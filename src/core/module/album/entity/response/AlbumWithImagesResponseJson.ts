import { ImageResponseJson } from '@core/module/image/entity/response/ImageResponseJson';
import { AlbumResponseJson } from './AlbumResponseJson';
import { ApiProperty } from '@nestjs/swagger';

export class AlbumWithImagesResponseJson {
  @ApiProperty({ type: AlbumResponseJson })
  album: AlbumResponseJson;
  @ApiProperty({ type: Array<ImageResponseJson> })
  images: ImageResponseJson[];
}
