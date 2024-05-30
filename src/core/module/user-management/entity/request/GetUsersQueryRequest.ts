import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class GetUsersQueryRequest {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;
}
