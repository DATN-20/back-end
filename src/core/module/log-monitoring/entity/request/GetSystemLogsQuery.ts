import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GetSystemLogsQuery {
  @ApiProperty({ type: Number, default: PAGINATION_MIN_LIMIT })
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @ApiProperty({ type: Number, default: PAGINATION_MIN_PAGE })
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;

  @ApiProperty({ default: new Date(), type: Date })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date(), type: Date })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
