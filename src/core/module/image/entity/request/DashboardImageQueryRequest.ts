import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

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
}
