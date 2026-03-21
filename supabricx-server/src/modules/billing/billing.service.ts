import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetCredits() {
    const users = await this.prisma.user.findMany({
      where: {
        creditResetAt: {
          lte: new Date(),
        },
      },
    });

    for (const user of users) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          credits: 50,
          creditsUsed: 0,
          creditResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await this.prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 50,
          balance: 50,
          reason: 'Monthly credit reset',
        },
      });
    }
  }

  getUsageHistory(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.creditTransaction.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
