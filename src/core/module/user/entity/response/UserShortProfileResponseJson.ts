import { ApiProperty } from '@nestjs/swagger';

export class UserShortProfileResponseJson {
  @ApiProperty()
  id: number;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  alias_name: string;
  @ApiProperty()
  avatar: string;
}
