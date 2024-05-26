import {
  PAGINATION_MAX_LIMIT,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_PAGE,
} from '@core/common/constant/Constant';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class SearchPromptRequest {
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number = PAGINATION_MIN_PAGE;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number = PAGINATION_MAX_LIMIT;
}
