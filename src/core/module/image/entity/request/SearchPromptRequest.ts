import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SearchPromptRequest {
  @IsNotEmpty()
  query: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;
}
