import { BackUpDataService } from '@core/module/schedule-job/BackUpDataService';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [BackUpDataService],
  exports: [BackUpDataService],
})
export class ScheduleJobModule {}
