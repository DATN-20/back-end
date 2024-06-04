import { ApiProperty } from '@nestjs/swagger';

export class ApiLogJson {
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  requested_at: Date;
  @ApiProperty()
  endpoint: string;
  @ApiProperty()
  severity: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  file: string;
}
