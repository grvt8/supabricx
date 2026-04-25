import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDiagramDto, UpdateDiagramDto } from './dto';

type DiagramPermissionRole = 'OWNER' | 'EDITOR' | 'VIEWER' | 'COMMENTER';

type DiagramWithAccess = {
  id: string;
  userId: string;
  isPublic: boolean;
  nodes: unknown;
  edges: unknown;
  permissions: Array<{ userId: string | null; role: DiagramPermissionRole }>;
  versions: Array<{ version: number }>;
};

@Injectable()
export class DiagramsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDiagramDto) {
    const nodes = dto.nodes ?? [];
    const edges = dto.edges ?? [];

    const diagram = await this.prisma.diagram.create({
      data: {
        name: dto.name,
        description: dto.description,
        nodes,
        edges,
        viewport: dto.viewport,
        userId,
      },
    });

    await this.prisma.diagramVersion.create({
      data: {
        diagramId: diagram.id,
        version: 1,
        nodes,
        edges,
        message: 'Initial version',
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId: diagram.id,
        action: 'DIAGRAM_CREATED',
      },
    });

    return diagram;
  }

  findAll(userId: string, filters?: { public?: boolean; template?: boolean }) {
    return this.prisma.diagram.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: filters?.public ?? false },
          { permissions: { some: { userId } } },
        ],
        ...(filters?.template !== undefined && {
          isTemplate: filters.template,
        }),
      },
      include: {
        user: {
          select: { username: true, avatarUrl: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const diagram = await this.loadDiagram(id);
    this.ensureCanView(diagram, userId);
    return diagram;
  }

  async update(id: string, userId: string, dto: UpdateDiagramDto) {
    const diagram = await this.assertCanEdit(id, userId);

    const updated = await this.prisma.diagram.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        description: dto.description ?? undefined,
        nodes: dto.nodes ?? undefined,
        edges: dto.edges ?? undefined,
        viewport: dto.viewport ?? undefined,
      },
    });

    if (dto.nodes || dto.edges) {
      const latestVersion = await this.prisma.diagramVersion.findFirst({
        where: { diagramId: id },
        orderBy: { version: 'desc' },
      });

      await this.prisma.diagramVersion.create({
        data: {
          diagramId: id,
          version: (latestVersion?.version || 0) + 1,
          nodes: dto.nodes ?? diagram.nodes,
          edges: dto.edges ?? diagram.edges,
          message: dto.versionMessage,
        },
      });
    }

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId: id,
        action: 'DIAGRAM_UPDATED',
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const diagram = await this.findOne(id, userId);

    if (diagram.userId !== userId) {
      throw new ForbiddenException('Only owner can delete');
    }

    await this.prisma.diagram.delete({ where: { id } });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId: id,
        action: 'DIAGRAM_DELETED',
      },
    });

    return { message: 'Diagram deleted successfully' };
  }

  async createVersion(id: string, userId: string, message?: string) {
    const diagram = await this.findOne(id, userId);

    const latestVersion = await this.prisma.diagramVersion.findFirst({
      where: { diagramId: id },
      orderBy: { version: 'desc' },
    });

    return this.prisma.diagramVersion.create({
      data: {
        diagramId: id,
        version: (latestVersion?.version || 0) + 1,
        nodes: diagram.nodes,
        edges: diagram.edges,
        message,
      },
    });
  }

  async restoreVersion(diagramId: string, versionId: string, userId: string) {
    const version = await this.prisma.diagramVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.diagramId !== diagramId) {
      throw new NotFoundException('Version not found');
    }

    return this.update(diagramId, userId, {
      nodes: version.nodes,
      edges: version.edges,
      versionMessage: `Restored from version ${version.version}`,
    });
  }

  async assertCanComment(id: string, userId: string) {
    const diagram = await this.loadDiagram(id);
    this.ensureCanComment(diagram, userId);
    return diagram;
  }

  async assertCanEdit(id: string, userId: string) {
    const diagram = await this.loadDiagram(id);
    this.ensureCanEdit(diagram, userId);
    return diagram;
  }

  private async loadDiagram(id: string) {
    const diagram = await this.prisma.diagram.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        permissions: true,
        versions: { orderBy: { version: 'desc' }, take: 5 },
      },
    });

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return diagram;
  }

  private ensureCanView(diagram: DiagramWithAccess, userId: string) {
    const canAccess =
      diagram.userId === userId ||
      diagram.isPublic ||
      diagram.permissions.some((permission) => permission.userId === userId);

    if (!canAccess) {
      throw new ForbiddenException('Access denied');
    }
  }

  private ensureCanComment(diagram: DiagramWithAccess, userId: string) {
    this.ensureCanView(diagram, userId);
  }

  private ensureCanEdit(diagram: DiagramWithAccess, userId: string) {
    const canEdit =
      diagram.userId === userId ||
      diagram.permissions.some(
        (permission) =>
          permission.userId === userId &&
          ['OWNER', 'EDITOR'].includes(permission.role),
      );

    if (!canEdit) {
      throw new ForbiddenException('Edit permission denied');
    }
  }
}
