import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GithubScannerService } from './github-scanner.service';

@Module({
  imports: [UsersModule],
  controllers: [AiController],
  providers: [AiService, GithubScannerService],
})
export class AiModule {}
