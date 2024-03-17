import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAlbumReq {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
