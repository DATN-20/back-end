import { ApiProperty } from '@nestjs/swagger';

export class SystemLogJson {
  @ApiProperty({ type: Date })
  requested_at: Date;
  @ApiProperty({ type: String })
  severity: string;
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: String })
  error_code: string;
  @ApiProperty({ type: String })
  back_trace: string;
  @ApiProperty({ type: String })
  file: string;
}
