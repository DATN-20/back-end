import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { ImageType } from '@core/common/enum/ImageType';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ImageFilterType } from '../filter/ImageFilter';

export class DashboardImageQueryRequest {
  @IsNotEmpty()
  @IsEnum(DashboardImageType)
  type: DashboardImageType;

  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;

  @IsOptional()
  style: string = '%';

  @IsOptional()
  aiName: string = '%';

  @IsOptional()
  imageType: ImageFilterType;
}
