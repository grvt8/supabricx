import {
  Body,
  Controller,
  Post,
  Request,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { GithubScannerService } from './github-scanner.service';

type MessageEventLike = { data: any };

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly githubScanner: GithubScannerService,
  ) {}

  @Post('chat')
  @Sse()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  chat(@Request() req: any, @Body('message') message: string): Observable<any> {
    return this.toSse(async () => this.aiService.chat(req.user.id, message));
  }

  @Post('generate')
  @Sse()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  generateDiagram(
    @Request() req: any,
    @Body('prompt') prompt: string,
  ): Observable<any> {
    return this.toSse(async () =>
      this.aiService.generateDiagram(req.user.id, prompt),
    );
  }

  @Post('analyze')
  @Sse()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  analyzeArchitecture(
    @Request() req: any,
    @Body('diagram') diagram: any,
  ): Observable<any> {
    return this.toSse(async () =>
      this.aiService.analyzeArchitecture(req.user.id, diagram),
    );
  }

  @Post('github/scan')
  @Throttle({ default: { limit: 2, ttl: 60_000 } })
  scanGithub(@Request() req: any, @Body('repoUrl') repoUrl: string) {
    return this.githubScanner.scanRepository(req.user.id, repoUrl);
  }

  private toSse(factory: () => Promise<any>): Observable<MessageEventLike> {
    return new Observable<MessageEventLike>((subscriber) => {
      let isCancelled = false;

      (async () => {
        try {
          const result = await factory();
          const stream: AsyncIterable<string> | undefined =
            (result as any)?.textStream ?? (result as any)?.textStream;

          if (!stream) {
            subscriber.next({ data: (result as any)?.text ?? result });
            subscriber.complete();
            return;
          }

          for await (const chunk of stream) {
            if (isCancelled) return;
            subscriber.next({ data: chunk });
          }
          subscriber.complete();
        } catch (err: any) {
          subscriber.error(err);
        }
      })();

      return () => {
        isCancelled = true;
      };
    });
  }
}
