import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageAlbumRequest {
  @ApiProperty()
  @IsNotEmpty()
  imageIds: number[];
}
