import { Module } from '@nestjs/common';
import { DiagramsModule } from '../diagrams/diagrams.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [DiagramsModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
