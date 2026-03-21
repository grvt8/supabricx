import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';

type GithubProfile = {
  githubId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
};

type JwtUser = {
  id: string;
  username: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async upsertUserFromGithubProfile(profile: GithubProfile) {
    const existing = await this.prisma.user.findUnique({
      where: { githubId: profile.githubId },
    });

    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          username: profile.username,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          name: profile.name,
          bio: profile.bio,
        },
      });
    }

    const baseUsername = profile.username || `gh_${profile.githubId}`;
    const baseEmail =
      profile.email ||
      `${baseUsername}-${profile.githubId}@users.noreply.github.com`;

    const tryCreate = async (username: string, email: string) =>
      this.prisma.user.create({
        data: {
          githubId: profile.githubId,
          username,
          email,
          avatarUrl: profile.avatarUrl,
          name: profile.name,
          bio: profile.bio,
        },
      });

    try {
      return await tryCreate(baseUsername, baseEmail);
    } catch (err) {
      const prismaError = err as { code?: string } | undefined;
      if (prismaError?.code === 'P2002') {
        const uniqueSuffix = randomUUID().slice(0, 8);
        return await tryCreate(
          `${baseUsername}-${uniqueSuffix}`,
          `${uniqueSuffix}-${baseEmail}`,
        );
      }
      throw err;
    }
  }

  async issueTokens(user: JwtUser) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiration =
      this.configService.get<string>('JWT_EXPIRATION') ?? '7d';
    const refreshSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const refreshExpiration =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRATION') ?? '30d';

    if (!jwtSecret || !refreshSecret) {
      throw new Error('Missing JWT secrets');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, username: user.username, role: user.role },
      { secret: jwtSecret, expiresIn: jwtExpiration as any },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, typ: 'refresh', jti: randomUUID() },
      { secret: refreshSecret, expiresIn: refreshExpiration as any },
    );

    const expiresAt = new Date(
      Date.now() + this.durationToMs(refreshExpiration),
    );

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, expiresAt, userId: user.id },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const refreshSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    if (!refreshSecret) throw new Error('Missing refresh token secret');

    let payload: { sub: string; typ?: string } | undefined;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload?.sub || payload.typ !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const record = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!record) throw new UnauthorizedException('Invalid refresh token');

    if (record.expiresAt.getTime() <= Date.now()) {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('User not found');

    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    return this.issueTokens(user);
  }

  logout(userId: string) {
    return this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  private durationToMs(value: string) {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d+)([smhd])$/);
    if (!match) {
      const asNumber = Number(trimmed);
      if (!Number.isFinite(asNumber) || asNumber <= 0) return 30 * 86400_000;
      return asNumber * 1000;
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return amount * (multipliers[unit] ?? 86_400_000);
  }
}
