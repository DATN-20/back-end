import { PAGINATION_MIN_LIMIT, PAGINATION_MIN_PAGE } from '@core/common/constant/Constant';
import { AcceptanceEndpoint } from '@core/common/enum/AcceptanceEndpoint';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetLogsQuery {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_LIMIT)
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(PAGINATION_MIN_PAGE)
  page: number;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @ApiProperty({ default: AcceptanceEndpoint.TEXT_TO_IMAGE })
  @IsOptional()
  @IsEnum(AcceptanceEndpoint)
  endpoint: AcceptanceEndpoint;
}
