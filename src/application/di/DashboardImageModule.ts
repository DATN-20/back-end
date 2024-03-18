import { DashboardImageRepository } from '@core/module/dashboard-image/DashboardImageRepository';
import { DashboardImageService } from '@core/module/dashboard-image/DashboardImageService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';

@Module({
  imports: [DrizzleModule, UserModule],
  providers: [DashboardImageRepository, DashboardImageService],
  exports: [DashboardImageRepository, DashboardImageService],
})
export class DashboardImageModule {}
