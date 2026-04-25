import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { R2Service } from './r2.service';

@Injectable()
export class StorageCronService {
  private readonly logger = new Logger(StorageCronService.name);

  constructor(private readonly r2Service: R2Service) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldExports() {
    this.logger.log('Starting R2 export cleanup');

    try {
      const deletedCount = await this.r2Service.cleanupOldExports(7);
      this.logger.log(`Deleted ${deletedCount} expired export files`);
    } catch (error) {
      this.logger.error('R2 export cleanup failed', error);
    }
  }
}
