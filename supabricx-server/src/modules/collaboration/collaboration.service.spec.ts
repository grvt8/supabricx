import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { DiagramsService } from '../diagrams/diagrams.service';
import { UsersService } from '../users/users.service';
import { CollaborationService } from './collaboration.service';

describe('CollaborationService', () => {
  it('creates a room snapshot from the diagram state on first join', async () => {
    const diagramsService = {
      findOne: jest.fn().mockResolvedValue({
        id: 'd1',
        nodes: [{ id: 'n1' }],
        edges: [{ id: 'e1' }],
        versions: [{ version: 3 }],
      }),
    } as unknown as DiagramsService;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CollaborationService,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: DiagramsService, useValue: diagramsService },
        {
          provide: PrismaService,
          useValue: {
            diagram: { update: jest.fn() },
          },
        },
      ],
    }).compile();

    const service = moduleRef.get(CollaborationService);
    const snapshot = await service.joinRoom(
      'd1',
      { id: 'u1', username: 'alice' },
      'socket-1',
    );

    expect(snapshot.revision).toBe(3);
    expect(snapshot.nodes).toEqual([{ id: 'n1' }]);
    expect(snapshot.edges).toEqual([{ id: 'e1' }]);
    expect(snapshot.participants).toHaveLength(1);
  });

  it('returns a conflict payload when an update is stale', async () => {
    const diagramsService = {
      findOne: jest.fn().mockResolvedValue({
        id: 'd1',
        nodes: [{ id: 'n1' }],
        edges: [{ id: 'e1' }],
        versions: [{ version: 2 }],
      }),
      assertCanEdit: jest.fn().mockResolvedValue(undefined),
    } as unknown as DiagramsService;

    const prisma = {
      diagram: { update: jest.fn() },
    } as unknown as PrismaService;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CollaborationService,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: DiagramsService, useValue: diagramsService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    const service = moduleRef.get(CollaborationService);
    await service.joinRoom('d1', { id: 'u1', username: 'alice' }, 'socket-1');

    const result = await service.updateNodes('u1', {
      diagramId: 'd1',
      baseRevision: 1,
      nodes: [{ id: 'n2' }],
      edges: [{ id: 'e1' }],
    });

    expect(result).toEqual({
      ok: false,
      reason: 'revision_conflict',
      revision: 2,
      nodes: [{ id: 'n1' }],
      edges: [{ id: 'e1' }],
    });
    expect((prisma as any).diagram.update).not.toHaveBeenCalled();
  });
});
