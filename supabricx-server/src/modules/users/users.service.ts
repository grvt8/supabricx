import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        diagrams: {
          where: { isTemplate: false },
          orderBy: { updatedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({ where: { githubId } });
  }

  updateProfile(userId: string, data: { name?: string; bio?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  getCredits(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, creditsUsed: true, creditResetAt: true },
    });
  }

  deductCredits(userId: string, amount: number, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (user.credits < amount) {
        throw new Error('Insufficient credits');
      }

      const newBalance = user.credits - amount;
      const newUsed = user.creditsUsed + amount;

      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance, creditsUsed: newUsed },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          balance: newBalance,
          reason,
        },
      });

      return { balance: newBalance, used: newUsed };
    });
  }

  addCredits(userId: string, amount: number, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const newBalance = user.credits + amount;

      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount,
          balance: newBalance,
          reason,
        },
      });

      return { balance: newBalance };
    });
  }
}
