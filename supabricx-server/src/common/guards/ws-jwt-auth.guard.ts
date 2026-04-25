import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from '../../modules/users/users.service';

type SocketUser = {
  id: string;
  githubId?: string;
  username?: string;
  email?: string;
  role?: string;
};

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    if (!client) {
      throw new UnauthorizedException('Socket client not available');
    }

    if (client.data.user) {
      return true;
    }

    const token = this.extractToken(client);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub?: string }>(token);
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid access token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      client.data.user = {
        id: user.id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        role: user.role,
      } satisfies SocketUser;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
