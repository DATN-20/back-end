import { ImageType } from '@core/common/enum/ImageType';
import { ApiProperty } from '@nestjs/swagger';

export class ImageJson {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: ImageType;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  ai_name: string;

  @ApiProperty()
  style: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  created_user: any;

  @ApiProperty()
  is_liked: boolean;

  @ApiProperty()
  like_number: number;

  @ApiProperty()
  remove_background: string;

  @ApiProperty()
  upscale: string;
}
