import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    super({
      datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    });
  }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) return;
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
