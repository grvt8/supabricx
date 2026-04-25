import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { githubConfig } from './config/github.config';
import { jwtConfig } from './config/jwt.config';
import { r2Config } from './config/r2.config';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { CommentsModule } from './modules/comments/comments.module';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { ExportModule } from './modules/export/export.module';
import { StorageModule } from './modules/storage/storage.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig, githubConfig, jwtConfig, r2Config],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {},
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') return {};

        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<string>('REDIS_PORT');
        if (!host || !port) return {};

        return {
          store: await redisStore({
            socket: { host, port: Number(port) },
          }),
        };
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    DiagramsModule,
    CommentsModule,
    CollaborationModule,
    AiModule,
    BillingModule,
    StorageModule,
    ExportModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
