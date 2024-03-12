import { DashboardImageRepository } from '@core/module/dashboard-image/DashboardImageRepository';
import { DashboardImageService } from '@core/module/dashboard-image/DashboardImageService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [DrizzleModule],
  providers: [DashboardImageRepository, DashboardImageService],
  exports: [DashboardImageRepository, DashboardImageService],
})
export class DashboardImageModule {}
