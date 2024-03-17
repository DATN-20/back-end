import { ImageType } from '@core/common/enum/ImageType';
import { ApiProperty } from '@nestjs/swagger';

export class ImageJson {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: ImageType;

  @ApiProperty()
  prompt: string;
}
