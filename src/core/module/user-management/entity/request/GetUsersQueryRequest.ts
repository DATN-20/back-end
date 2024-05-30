import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetUsersQueryRequest {
  @ApiProperty({ default: PAGINATION_MIN_LIMIT })
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @ApiProperty({ default: PAGINATION_MIN_PAGE })
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;
}
