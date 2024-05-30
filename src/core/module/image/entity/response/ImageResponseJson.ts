import { ImageType } from '@core/common/enum/ImageType';
import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';
import { ApiProperty } from '@nestjs/swagger';

export class ImageResponseJson {
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
  created_user: UserShortProfileResponseJson;
  @ApiProperty()
  is_liked: boolean;
  @ApiProperty()
  like_number: number;
  @ApiProperty()
  remove_background: string;
  @ApiProperty()
  upscale: string;
  @ApiProperty()
  visibility: boolean;
}
