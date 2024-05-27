import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../image/ImageRepository';
import { ImageStatisticsRequest } from './entity/request/ImageStatisticsRequest';
import { ImageFilter } from '../image/entity/filter/ImageFilter';
import { AnalysisWithDateJson } from '../user-management/entity/response/AnalysisWithDateJson';
import { DateUtil } from '@core/common/util/DateUtil';
import { DateUnit } from '@core/common/enum/DateUnit';

@Injectable()
export class ImageStatisticsService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async countGeneratedImages(req: ImageStatisticsRequest): Promise<AnalysisWithDateJson[]> {
    const filter: ImageFilter = {
      style: req.style,
      aiName: req.aiName,
      imageType: req.imageType,
    };
    let processing_date = req.startDate;
    let result: AnalysisWithDateJson[] = [];

    while (processing_date <= req.endDate) {
      const analysis_processing_date = await this.imageRepository.countGeneratedImages(
        processing_date,
        filter,
      );

      result.push({
        date: processing_date,
        total: analysis_processing_date,
      });

      processing_date = DateUtil.addDate(processing_date, 1, DateUnit.DAYS);
    }

    return result;
  }
}
