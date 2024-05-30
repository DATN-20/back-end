import { ApiProperty } from '@nestjs/swagger';

export class Social {
  @ApiProperty()
  social_name: string;
  @ApiProperty()
  social_link: string;
}
