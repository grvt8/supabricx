import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';
import { CommentsService } from '../comments/comments.service';
import {
  CollaborationService,
  CursorPayload,
  DiagramSyncPayload,
} from './collaboration.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? true,
    credentials: true,
  },
})
@UseGuards(WsJwtAuthGuard)
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly collaborationService: CollaborationService,
    private readonly commentsService: CommentsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const diagramId = this.getDiagramId(client);
      const user = await this.collaborationService.authenticateClient(client);
      const snapshot = await this.collaborationService.joinRoom(
        diagramId,
        user,
        client.id,
      );

      client.join(this.room(diagramId));
      client.emit('diagram:state', snapshot);
      client.to(this.room(diagramId)).emit('user:joined', {
        diagramId,
        user,
        participants: this.collaborationService.listParticipants(diagramId),
      });
    } catch {
      client.emit('collaboration:error', {
        message: 'Unable to establish collaboration session',
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const disconnected = this.collaborationService.removeConnection(client.id);
    if (!disconnected?.disconnected) {
      return;
    }

    this.server.to(this.room(disconnected.diagramId)).emit('user:left', {
      diagramId: disconnected.diagramId,
      userId: disconnected.userId,
      user: disconnected.user,
      participants: this.collaborationService.listParticipants(
        disconnected.diagramId,
      ),
    });
  }

  @SubscribeMessage('node:update')
  async handleNodeUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: DiagramSyncPayload,
  ) {
    const user = client.data.user;
    const result = await this.collaborationService.updateNodes(user.id, payload);

    if (!result.ok) {
      client.emit('diagram:conflict', {
        diagramId: payload.diagramId,
        ...result,
      });
      return;
    }

    client.emit('diagram:ack', {
      diagramId: payload.diagramId,
      revision: result.revision,
    });
    client.to(this.room(payload.diagramId)).emit('node:sync', {
      diagramId: payload.diagramId,
      userId: user.id,
      revision: result.revision,
      nodes: result.nodes,
      edges: result.edges,
    });
  }

  @SubscribeMessage('edge:update')
  async handleEdgeUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: DiagramSyncPayload,
  ) {
    const user = client.data.user;
    const result = await this.collaborationService.updateEdges(user.id, payload);

    if (!result.ok) {
      client.emit('diagram:conflict', {
        diagramId: payload.diagramId,
        ...result,
      });
      return;
    }

    client.emit('diagram:ack', {
      diagramId: payload.diagramId,
      revision: result.revision,
    });
    client.to(this.room(payload.diagramId)).emit('edge:sync', {
      diagramId: payload.diagramId,
      userId: user.id,
      revision: result.revision,
      nodes: result.nodes,
      edges: result.edges,
    });
  }

  @SubscribeMessage('cursor:move')
  async handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CursorPayload,
  ) {
    const user = client.data.user;
    const cursor = await this.collaborationService.trackCursor(user.id, payload);

    client.to(this.room(payload.diagramId)).emit('cursor:update', {
      ...cursor,
      username: user.username,
    });
  }

  @SubscribeMessage('comment:add')
  async handleCommentAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      diagramId: string;
      content: string;
      nodeId?: string;
      parentId?: string;
    },
  ) {
    const user = client.data.user;
    const comment = await this.commentsService.create(payload.diagramId, user.id, {
      content: payload.content,
      nodeId: payload.nodeId,
      parentId: payload.parentId,
    });

    this.server.to(this.room(payload.diagramId)).emit('comment:added', comment);
    return comment;
  }

  @SubscribeMessage('comment:resolve')
  async handleCommentResolve(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { diagramId: string; commentId: string },
  ) {
    const user = client.data.user;
    const comment = await this.commentsService.resolve(
      payload.diagramId,
      payload.commentId,
      user.id,
    );

    this.server.to(this.room(payload.diagramId)).emit('comment:resolved', comment);
    return comment;
  }

  private getDiagramId(client: Socket) {
    const diagramId = client.handshake.query.diagramId;
    if (typeof diagramId !== 'string' || diagramId.length === 0) {
      throw new WsException('diagramId is required');
    }

    return diagramId;
  }

  private room(diagramId: string) {
    return `diagram:${diagramId}`;
  }
}
