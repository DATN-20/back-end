import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteImageRequest {
  @ApiProperty()
  @IsNotEmpty()
  ids: number[];
}
