import { DEFAULT_ALL } from '@core/common/constant/Constant';
import { ImageStatisticsType } from '@core/common/enum/StatisticsType';
import { ImageFilterType } from '@core/module/image/entity/filter/ImageFilter';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class ImageStatisticsRequest {
  @IsOptional()
  typeStatistics: ImageStatisticsType = ImageStatisticsType.DAY;

  @IsOptional()
  style: string = DEFAULT_ALL;

  @IsOptional()
  aiName: string = DEFAULT_ALL;

  @IsOptional()
  imageType: ImageFilterType = ImageFilterType.ALL;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
