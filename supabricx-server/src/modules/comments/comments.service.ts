import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DiagramsService } from '../diagrams/diagrams.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diagramsService: DiagramsService,
  ) {}

  async create(diagramId: string, userId: string, dto: CreateCommentDto) {
    await this.diagramsService.assertCanComment(diagramId, userId);

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent || parent.diagramId !== diagramId) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        diagramId,
        userId,
        content: dto.content,
        nodeId: dto.nodeId,
        parentId: dto.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId,
        action: 'COMMENT_CREATED',
        metadata: {
          commentId: comment.id,
          nodeId: comment.nodeId,
          parentId: comment.parentId,
        },
      },
    });

    return comment;
  }

  async findAll(diagramId: string, userId: string) {
    await this.diagramsService.findOne(diagramId, userId);

    return this.prisma.comment.findMany({
      where: { diagramId, parentId: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async resolve(diagramId: string, commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        diagram: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!comment || comment.diagramId !== diagramId) {
      throw new NotFoundException('Comment not found');
    }

    const canResolve =
      comment.userId === userId ||
      comment.diagram.userId === userId ||
      comment.diagram.permissions.some(
        (permission) =>
          permission.userId === userId &&
          ['OWNER', 'EDITOR'].includes(permission.role),
      );

    if (!canResolve) {
      throw new ForbiddenException('Resolve permission denied');
    }

    const resolved = await this.prisma.comment.update({
      where: { id: commentId },
      data: { resolved: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId,
        action: 'COMMENT_RESOLVED',
        metadata: {
          commentId: resolved.id,
        },
      },
    });

    return resolved;
  }
}
