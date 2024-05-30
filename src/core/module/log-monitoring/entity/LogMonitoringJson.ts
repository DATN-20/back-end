import { ApiProperty } from '@nestjs/swagger';

export class LogMonitoringJson {
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
