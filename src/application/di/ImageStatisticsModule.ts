import { ImageStatisticsController } from '@core/module/image-statistics/ImageStatisticsController';
import { ImageStatisticsService } from '@core/module/image-statistics/ImageStatisticsService';
import { Module } from '@nestjs/common';
import { ImageModule } from './ImageModule';

@Module({
  imports: [ImageModule],
  controllers: [ImageStatisticsController],
  providers: [ImageStatisticsService],
})
export class ImageStatisticsModule {}
