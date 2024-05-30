import {
  DEFAULT_ALL,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_PAGE,
} from '@core/common/constant/Constant';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ImageFilterType } from '../filter/ImageFilter';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardImageQueryRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DashboardImageType)
  type: DashboardImageType;

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

  @ApiProperty({ default: DEFAULT_ALL })
  @IsOptional()
  style: string = DEFAULT_ALL;

  @ApiProperty({ default: DEFAULT_ALL })
  @IsOptional()
  aiName: string = DEFAULT_ALL;

  @ApiProperty({ default: ImageFilterType.ALL })
  @IsOptional()
  imageType: ImageFilterType = ImageFilterType.ALL;
}
