import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class EditAlbumReq {
  @ApiProperty()
  @IsOptional()
  name: string;
}
