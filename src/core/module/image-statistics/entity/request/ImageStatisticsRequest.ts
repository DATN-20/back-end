import { DEFAULT_ALL } from '@core/common/constant/Constant';
import { ImageFilterType } from '@core/module/image/entity/filter/ImageFilter';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class ImageStatisticsRequest {
  @IsOptional()
  style: string = DEFAULT_ALL;

  @IsOptional()
  aiName: string = DEFAULT_ALL;

  @IsOptional()
  imageType: ImageFilterType = ImageFilterType.ALL;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
