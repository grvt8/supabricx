import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION ?? '7d',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d',
}));
