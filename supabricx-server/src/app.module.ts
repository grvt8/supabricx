import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { githubConfig } from './config/github.config';
import { jwtConfig } from './config/jwt.config';
import { s3Config } from './config/s3.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig, githubConfig, jwtConfig, s3Config],
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
