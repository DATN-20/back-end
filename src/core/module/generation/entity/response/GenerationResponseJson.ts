import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { ApiProperty } from '@nestjs/swagger';

export class GenerationResponseJson {
  @ApiProperty()
  id: string;
  @ApiProperty()
  status: GenerationStatus;
  @ApiProperty()
  created_at: Date;
}
