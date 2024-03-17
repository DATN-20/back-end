import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseJson {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
