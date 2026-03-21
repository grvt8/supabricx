import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'test_secret',
    });
  }

  async validate(payload: { sub?: string }) {
    if (!payload?.sub) throw new UnauthorizedException();
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
