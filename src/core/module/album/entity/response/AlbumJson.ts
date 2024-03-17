import { UserInfoJson } from '@core/module/user/entity/response/UserInfoJson';
import { ApiProperty } from '@nestjs/swagger';

export class AlbumJson {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  created_user: UserInfoJson;
}
