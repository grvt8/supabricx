import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommentsModule } from '../comments/comments.module';
import { DiagramsModule } from '../diagrams/diagrams.module';
import { UsersModule } from '../users/users.module';
import { CollaborationGateway } from './collaboration.gateway';
import { CollaborationService } from './collaboration.service';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';

@Module({
  imports: [AuthModule, UsersModule, DiagramsModule, CommentsModule],
  providers: [CollaborationGateway, CollaborationService, WsJwtAuthGuard],
})
export class CollaborationModule {}
