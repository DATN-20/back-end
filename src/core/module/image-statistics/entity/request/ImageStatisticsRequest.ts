import { DEFAULT_ALL } from '@core/common/constant/Constant';
import { ImageFilterType } from '@core/module/image/entity/filter/ImageFilter';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class ImageStatisticsRequest {
  @ApiProperty({ default: DEFAULT_ALL })
  @IsOptional()
  style: string = DEFAULT_ALL;

  @ApiProperty({ default: DEFAULT_ALL })
  @IsOptional()
  aiName: string = DEFAULT_ALL;

  @ApiProperty({ default: ImageFilterType.ALL })
  @IsOptional()
  imageType: ImageFilterType = ImageFilterType.ALL;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
