import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DiagramsService } from '../diagrams/diagrams.service';
import { PrismaService } from '../../database/prisma.service';

export type CollaborationUser = {
  id: string;
  username?: string;
  avatarUrl?: string | null;
  role?: string;
};

export type DiagramSyncPayload = {
  diagramId: string;
  baseRevision: number;
  nodes: Record<string, unknown>[];
  edges?: Record<string, unknown>[];
  viewport?: Record<string, unknown>;
};

export type CursorPayload = {
  diagramId: string;
  x: number;
  y: number;
  nodeId?: string;
};

type RoomParticipant = {
  user: CollaborationUser;
  socketIds: Set<string>;
  cursor?: Omit<CursorPayload, 'diagramId'>;
};

type RoomState = {
  diagramId: string;
  revision: number;
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
  participants: Map<string, RoomParticipant>;
};

@Injectable()
export class CollaborationService {
  private readonly rooms = new Map<string, RoomState>();
  private readonly socketIndex = new Map<string, { diagramId: string; userId: string }>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly diagramsService: DiagramsService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticateClient(client: Socket) {
    if (client.data.user) {
      return client.data.user as CollaborationUser;
    }

    const token = this.extractToken(client);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub?: string }>(token);
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid access token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      client.data.user = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
      } satisfies CollaborationUser;

      return client.data.user as CollaborationUser;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async joinRoom(diagramId: string, user: CollaborationUser, socketId: string) {
    const room = await this.getOrCreateRoom(diagramId, user.id);
    const existingParticipant = room.participants.get(user.id);

    if (existingParticipant) {
      existingParticipant.socketIds.add(socketId);
      existingParticipant.user = {
        ...existingParticipant.user,
        ...user,
      };
    } else {
      room.participants.set(user.id, {
        user,
        socketIds: new Set([socketId]),
      });
    }

    this.socketIndex.set(socketId, { diagramId, userId: user.id });

    return {
      diagramId,
      revision: room.revision,
      nodes: room.nodes,
      edges: room.edges,
      participants: this.listParticipants(diagramId),
    };
  }

  removeConnection(socketId: string) {
    const connection = this.socketIndex.get(socketId);
    if (!connection) {
      return null;
    }

    this.socketIndex.delete(socketId);
    const room = this.rooms.get(connection.diagramId);
    if (!room) {
      return null;
    }

    const participant = room.participants.get(connection.userId);
    if (!participant) {
      return null;
    }

    participant.socketIds.delete(socketId);
    if (participant.socketIds.size > 0) {
      return {
        diagramId: connection.diagramId,
        userId: connection.userId,
        user: participant.user,
        disconnected: false,
      };
    }

    room.participants.delete(connection.userId);
    if (room.participants.size === 0) {
      this.rooms.delete(connection.diagramId);
    }

    return {
      diagramId: connection.diagramId,
      userId: connection.userId,
      user: participant.user,
      disconnected: true,
    };
  }

  async updateNodes(userId: string, payload: DiagramSyncPayload) {
    await this.diagramsService.assertCanEdit(payload.diagramId, userId);
    const room = await this.getOrCreateRoom(payload.diagramId, userId);

    if (payload.baseRevision !== room.revision) {
      return this.buildConflict(room);
    }

    room.nodes = payload.nodes;
    if (payload.edges) {
      room.edges = payload.edges;
    }
    room.revision += 1;

    await this.prisma.diagram.update({
      where: { id: payload.diagramId },
      data: {
        nodes: room.nodes,
        edges: room.edges,
        viewport: payload.viewport,
      },
    });

    return {
      ok: true as const,
      revision: room.revision,
      nodes: room.nodes,
      edges: room.edges,
    };
  }

  async updateEdges(userId: string, payload: DiagramSyncPayload) {
    await this.diagramsService.assertCanEdit(payload.diagramId, userId);
    const room = await this.getOrCreateRoom(payload.diagramId, userId);

    if (payload.baseRevision !== room.revision) {
      return this.buildConflict(room);
    }

    room.edges = payload.edges ?? room.edges;
    room.nodes = payload.nodes ?? room.nodes;
    room.revision += 1;

    await this.prisma.diagram.update({
      where: { id: payload.diagramId },
      data: {
        nodes: room.nodes,
        edges: room.edges,
        viewport: payload.viewport,
      },
    });

    return {
      ok: true as const,
      revision: room.revision,
      nodes: room.nodes,
      edges: room.edges,
    };
  }

  async trackCursor(userId: string, payload: CursorPayload) {
    await this.diagramsService.findOne(payload.diagramId, userId);
    const room = await this.getOrCreateRoom(payload.diagramId, userId);
    const participant = room.participants.get(userId);

    if (participant) {
      participant.cursor = {
        x: payload.x,
        y: payload.y,
        nodeId: payload.nodeId,
      };
    }

    return {
      userId,
      ...payload,
    };
  }

  listParticipants(diagramId: string) {
    const room = this.rooms.get(diagramId);
    if (!room) {
      return [];
    }

    return Array.from(room.participants.values()).map((participant) => ({
      ...participant.user,
      cursor: participant.cursor,
    }));
  }

  private async getOrCreateRoom(diagramId: string, userId: string) {
    const existing = this.rooms.get(diagramId);
    if (existing) {
      return existing;
    }

    const diagram = await this.diagramsService.findOne(diagramId, userId);
    const room: RoomState = {
      diagramId,
      revision: diagram.versions[0]?.version ?? 1,
      nodes: this.asArray(diagram.nodes),
      edges: this.asArray(diagram.edges),
      participants: new Map(),
    };

    this.rooms.set(diagramId, room);
    return room;
  }

  private buildConflict(room: RoomState) {
    return {
      ok: false as const,
      reason: 'revision_conflict',
      revision: room.revision,
      nodes: room.nodes,
      edges: room.edges,
    };
  }

  private asArray(value: unknown) {
    return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
