import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(GitHubStrategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') ?? 'dummy',
      clientSecret:
        configService.get<string>('GITHUB_CLIENT_SECRET') ?? 'dummy',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') ??
        'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    const githubId = String(profile?.id);
    const username = String(profile?.username ?? `gh_${githubId}`);

    const emails: Array<{ value?: string; primary?: boolean }> =
      profile?.emails ?? [];
    const email =
      emails.find((e) => e?.primary && e?.value)?.value ??
      emails.find((e) => e?.value)?.value ??
      `${username}-${githubId}@users.noreply.github.com`;

    const avatarUrl: string | undefined =
      profile?.photos?.[0]?.value ?? profile?._json?.avatar_url;

    const name: string | undefined =
      profile?.displayName ?? profile?._json?.name;
    const bio: string | undefined = profile?._json?.bio;

    return this.authService.upsertUserFromGithubProfile({
      githubId,
      username,
      email,
      avatarUrl,
      name,
      bio,
    });
  }
}
