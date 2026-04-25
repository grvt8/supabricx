import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl && process.env.NODE_ENV !== 'test') {
      throw new Error('DATABASE_URL is required');
    }

    super({
      adapter: new PrismaPg({
        connectionString:
          databaseUrl ?? 'postgresql://postgres:postgres@localhost:5432/postgres',
      }),
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
