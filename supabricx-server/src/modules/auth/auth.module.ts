import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './strategies/github.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'test_secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRATION') ??
            '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
