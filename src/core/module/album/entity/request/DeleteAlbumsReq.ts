import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteAlbumReq {
  @ApiProperty()
  @IsNotEmpty()
  albumIds: number[];
}
