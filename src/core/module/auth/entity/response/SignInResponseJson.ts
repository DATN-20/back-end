import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseJson {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}
