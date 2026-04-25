import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DiagramsService } from '../diagrams/diagrams.service';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diagramsService: DiagramsService,
  ) {}

  findAll() {
    return this.prisma.diagram.findMany({
      where: { isTemplate: true, isPublic: true },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.diagram.findFirst({
      where: { id, isTemplate: true, isPublic: true },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async create(
    userId: string,
    diagramId: string,
    data: { name: string; description?: string },
  ) {
    const diagram = await this.diagramsService.findOne(diagramId, userId);

    if (diagram.userId !== userId) {
      throw new ForbiddenException('Only owner can publish templates');
    }

    const template = await this.prisma.diagram.create({
      data: {
        name: data.name,
        description: data.description ?? diagram.description,
        nodes: diagram.nodes,
        edges: diagram.edges,
        viewport: diagram.viewport,
        isTemplate: true,
        isPublic: true,
        userId,
        thumbnailUrl: diagram.thumbnailUrl,
      },
    });

    await this.prisma.diagramVersion.create({
      data: {
        diagramId: template.id,
        version: 1,
        nodes: diagram.nodes,
        edges: diagram.edges,
        message: 'Template created',
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId: template.id,
        action: 'TEMPLATE_CREATED',
        metadata: { sourceDiagramId: diagramId },
      },
    });

    return template;
  }

  async useTemplate(userId: string, templateId: string, data?: { name?: string }) {
    const template = await this.findOne(templateId);

    const diagram = await this.prisma.diagram.create({
      data: {
        name: data?.name || `${template.name} Copy`,
        description: template.description,
        nodes: template.nodes,
        edges: template.edges,
        viewport: template.viewport,
        userId,
        isTemplate: false,
        isPublic: false,
        thumbnailUrl: template.thumbnailUrl,
      },
    });

    await this.prisma.diagramVersion.create({
      data: {
        diagramId: diagram.id,
        version: 1,
        nodes: template.nodes,
        edges: template.edges,
        message: `Created from template ${template.name}`,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId: diagram.id,
        action: 'TEMPLATE_USED',
        metadata: { templateId },
      },
    });

    return diagram;
  }
}
