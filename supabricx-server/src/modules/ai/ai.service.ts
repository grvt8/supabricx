import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async chat(
    userId: string,
    message: string,
    diagramContext?: any,
  ): Promise<any> {
    await this.usersService.deductCredits(userId, 2, 'AI_CHAT_MESSAGE');

    const systemPrompt = `You are Supabricx AI, an architecture design assistant.
Help users design, analyze, and improve their system architecture.
Be concise and technical. Use markdown for code blocks.`;

    const modelName =
      this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o';

    const result = await streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_CHAT',
        metadata: { message, diagramId: diagramContext?.id },
      },
    });

    return result as any;
  }

  async generateDiagram(userId: string, prompt: string): Promise<any> {
    await this.usersService.deductCredits(userId, 10, 'AI_DIAGRAM_GENERATION');

    const systemPrompt = `You are a diagram generator. Output JSON with nodes and edges.
Available node types: microservice, database, gateway, cache, queue, vpc, subnet, cdn, auth, logging, metrics, user, external_api
Available edge types: http, tcp, async, stream

Output format:
{
  "nodes": [{"id": "1", "type": "microservice", "label": "API Gateway"}],
  "edges": [{"source": "1", "target": "2", "type": "http"}]
}`;

    const modelName =
      this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o';

    return streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }) as any;
  }

  async analyzeArchitecture(userId: string, diagram: any): Promise<any> {
    await this.usersService.deductCredits(userId, 20, 'ARCHITECTURE_ANALYSIS');

    const prompt = `Analyze this architecture diagram for:
1. Single points of failure
2. Security vulnerabilities
3. Scalability issues
4. Cost optimization opportunities

Diagram: ${JSON.stringify(diagram)}

Output suggestions with severity (high/medium/low) and recommended fixes.`;

    const modelName =
      this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o';

    return streamText({
      model: openai(modelName),
      messages: [{ role: 'user', content: prompt }],
    }) as any;
  }
}
