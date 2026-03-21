import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { AiService } from './ai.service';

jest.mock('ai', () => ({
  streamText: jest.fn(async () => ({
    textStream: (async function* () {
      yield 'hello';
      yield 'world';
    })(),
  })),
}));

jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn(() => ({ model: 'mock' })),
}));

describe('AiService', () => {
  it('deducts credits and logs activity for chat', async () => {
    const usersService = {
      deductCredits: jest.fn(),
    } as unknown as UsersService;
    const prisma = {
      activityLog: { create: jest.fn() },
    } as unknown as PrismaService;
    const config = {
      get: jest.fn().mockReturnValue('gpt-4o'),
    } as unknown as ConfigService;

    const moduleRef = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: UsersService, useValue: usersService },
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    const service = moduleRef.get(AiService);
    await service.chat('u1', 'hi');

    expect(usersService.deductCredits).toHaveBeenCalledWith(
      'u1',
      2,
      'AI_CHAT_MESSAGE',
    );
    expect(prisma.activityLog.create).toHaveBeenCalled();
  });
});
