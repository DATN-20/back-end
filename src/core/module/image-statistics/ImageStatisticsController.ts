import { AdminGuard } from '@core/common/guard/AdminGuard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ImageStatisticsService } from './ImageStatisticsService';
import { ImageStatisticsResponse } from './entity/response/ImageStatisticsResponse';
import { ImageStatisticsRequest } from './entity/request/ImageStatisticsRequest';

@Controller('/statistic/images')
@UseGuards(AdminGuard)
export class ImageStatisticsController {
  constructor(private readonly userStatisticsService: ImageStatisticsService) {}

  @Get('generated')
  async countgeneratedImages(
    @Query() query_data: ImageStatisticsRequest,
  ): Promise<ImageStatisticsResponse[]> {
    return this.userStatisticsService.countGeneratedImages(query_data);
  }
}
