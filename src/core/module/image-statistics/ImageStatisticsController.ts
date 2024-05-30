import { AdminGuard } from '@core/common/guard/AdminGuard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ImageStatisticsService } from './ImageStatisticsService';
import { ImageStatisticsRequest } from './entity/request/ImageStatisticsRequest';
import { DateUtil } from '@core/common/util/DateUtil';
import { AnalysisWithQueryJson } from '../user-management/entity/response/AnalysisWithDateJson';

@Controller('/admin/statistic/images')
@UseGuards(AdminGuard)
export class ImageStatisticsController {
  constructor(private readonly userStatisticsService: ImageStatisticsService) {}

  @Get('generated')
  async countgeneratedImages(
    @Query() query_data: ImageStatisticsRequest,
  ): Promise<AnalysisWithQueryJson> {
    DateUtil.validateRangeDate(query_data.startDate, query_data.endDate);
    const result = await this.userStatisticsService.countGeneratedImages(query_data);
    return {
      start_date: query_data.startDate,
      end_date: query_data.endDate,
      data: result,
    };
  }
}
