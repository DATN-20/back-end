import { ImageResponseJson } from '@core/module/image/entity/response/ImageResponseJson';
import { AlbumResponseJson } from './AlbumResponseJson';

export interface AlbumWithImagesResponseJson {
  album: AlbumResponseJson;
  images: ImageResponseJson[];
}
