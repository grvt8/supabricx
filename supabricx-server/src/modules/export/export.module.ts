import { Module } from '@nestjs/common';
import { DiagramsModule } from '../diagrams/diagrams.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { DiagramExportService } from './diagram-export.service';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  imports: [UsersModule, DiagramsModule, StorageModule],
  controllers: [ExportController],
  providers: [ExportService, DiagramExportService],
})
export class ExportModule {}
