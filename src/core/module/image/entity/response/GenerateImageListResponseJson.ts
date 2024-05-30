import { ApiProperty } from '@nestjs/swagger';
import { ImageResponseJson } from './ImageResponseJson';

export class GenerateImageListResponseJson {
  @ApiProperty()
  style: string;
  @ApiProperty()
  prompt: string;
  @ApiProperty()
  images: ImageResponseJson[];
}
