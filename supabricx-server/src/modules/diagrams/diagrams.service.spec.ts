import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DiagramsService } from './diagrams.service';

describe('DiagramsService', () => {
  it('throws NotFoundException when diagram is missing', async () => {
    const prisma = {
      diagram: { findUnique: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const moduleRef = await Test.createTestingModule({
      providers: [
        DiagramsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    const service = moduleRef.get(DiagramsService);
    await expect(service.findOne('d1', 'u1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ForbiddenException when user cannot access', async () => {
    const prisma = {
      diagram: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'd1',
          userId: 'owner',
          isPublic: false,
          permissions: [],
          versions: [],
          user: { id: 'owner', username: 'x' },
        }),
      },
    } as unknown as PrismaService;

    const moduleRef = await Test.createTestingModule({
      providers: [
        DiagramsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    const service = moduleRef.get(DiagramsService);
    await expect(service.findOne('d1', 'intruder')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
