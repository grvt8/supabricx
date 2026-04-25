import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageCronService } from './storage-cron.service';
import { R2Service } from './r2.service';

@Module({
  controllers: [StorageController],
  providers: [R2Service, StorageCronService],
  exports: [R2Service],
})
export class StorageModule {}
