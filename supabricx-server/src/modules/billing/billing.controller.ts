import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('usage')
  usage(@CurrentUser() user: RequestUser, @Query('days') days?: string) {
    const parsed = days ? Number(days) : 30;
    return this.billingService.getUsageHistory(
      user.id,
      Number.isFinite(parsed) ? parsed : 30,
    );
  }
}
