import { ApiProperty } from '@nestjs/swagger';

export class AiModelJson {
  @ApiProperty()
  name: string;

  @ApiProperty()
  ai_name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
