import { Test } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  it('returns usage history', async () => {
    const prisma = {
      creditTransaction: { findMany: jest.fn().mockResolvedValue([]) },
    } as unknown as PrismaService;

    const moduleRef = await Test.createTestingModule({
      providers: [BillingService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(BillingService);
    const res = await service.getUsageHistory('u1', 7);
    expect(res).toEqual([]);
  });
});
