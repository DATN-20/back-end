import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';
import { ApiProperty } from '@nestjs/swagger';

export class AlbumResponseJson {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
  @ApiProperty({ type: UserShortProfileResponseJson })
  created_user: UserShortProfileResponseJson;
}
