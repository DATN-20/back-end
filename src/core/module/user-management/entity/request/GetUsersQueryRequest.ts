import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class GetUsersQueryRequest {
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;
}
