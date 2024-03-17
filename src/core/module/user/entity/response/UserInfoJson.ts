import { ApiProperty } from '@nestjs/swagger';

export class UserInfoJson {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  alias_name: string;
}
