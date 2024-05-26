import { ImageStatisticsController } from '@core/module/image-statistics/ImageStatisticsController';
import { ImageStatisticsService } from '@core/module/image-statistics/ImageStatisticsService';
import { Module } from '@nestjs/common';
import { ImageModule } from './ImageModule';
import { UserModule } from './UserModule';

@Module({
  imports: [ImageModule, UserModule],
  controllers: [ImageStatisticsController],
  providers: [ImageStatisticsService],
})
export class ImageStatisticsModule {}
