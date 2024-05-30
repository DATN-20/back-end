import {
  PAGINATION_MAX_LIMIT,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_PAGE,
} from '@core/common/constant/Constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class SearchPromptRequest {
  @ApiProperty()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ default: PAGINATION_MIN_PAGE })
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number = PAGINATION_MIN_PAGE;

  @ApiProperty({ default: PAGINATION_MAX_LIMIT })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number = PAGINATION_MAX_LIMIT;
}
