import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../image/ImageRepository';
import { ImageStatisticsResponse } from './entity/response/ImageStatisticsResponse';
import { ImageStatisticsRequest } from './entity/request/ImageStatisticsRequest';
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek } from 'date-fns';
import { ImageFilter } from '../image/entity/filter/ImageFilter';
import { ImageStatisticsType } from '@core/common/enum/ImageStatisticsType';

@Injectable()
export class ImageStatisticsService {
  public constructor(private readonly imageRepository: ImageRepository) {}

  public async countGeneratedImages(
    req: ImageStatisticsRequest,
  ): Promise<ImageStatisticsResponse[]> {
    if (req.startDate === undefined || req.endDate === undefined) {
      req.endDate = new Date();
      req.startDate = new Date();

      const now = new Date();
      req.endDate.setDate(now.getDate() + 1);
      req.startDate.setDate(now.getDate() - 8);
    }

    let labels: string[] = [];
    const filter: ImageFilter = {
      style: req.style,
      aiName: req.aiName,
      imageType: req.imageType,
    };

    switch (req.typeStatistics) {
      case ImageStatisticsType.WEEK:
        for (
          let date = startOfWeek(req.startDate, { weekStartsOn: 1 });
          date <= req.endDate;
          date = addWeeks(date, 1)
        ) {
          labels.push(format(date, 'yyyy-II'));
        }

        break;
      case ImageStatisticsType.MONTH:
        for (let date = req.startDate; date <= req.endDate; date = addMonths(date, 1)) {
          labels.push(format(date, 'yyyy-MM'));
        }

        break;
      case ImageStatisticsType.YEAR:
        for (let date = req.startDate; date <= req.endDate; date = addYears(date, 1)) {
          labels.push(format(date, 'yyyy'));
        }

        break;
      default:
        for (let date = req.startDate; date <= req.endDate; date = addDays(date, 1)) {
          labels.push(format(date, 'yyyy-MM-dd'));
        }

        break;
    }

    const result = await this.imageRepository.countGeneratedImages(
      req.startDate,
      req.endDate,
      filter,
      req.typeStatistics,
    );

    const dict: { [key: string]: number } = result.reduce((acc, item) => {
      acc[item.date] = item.total;
      return acc;
    }, {} as { [key: string]: number });

    const filledResult = labels.map(label => ({
      date: label,
      total: dict[label] ?? 0,
    }));
    return filledResult;
  }
}
