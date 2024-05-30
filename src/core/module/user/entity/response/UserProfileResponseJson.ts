import { Social } from '@core/common/type/Social';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseJson {
  @ApiProperty()
  id: number;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: Social, isArray: true })
  socials: Social[];
  @ApiProperty()
  alias_name: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  background: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
