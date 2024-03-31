import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';
import { Album } from '../Album';
import { ImageAlbumResponse } from '@core/module/images-album/entity/response/ImageAlbumResponse';

export class AlbumWithImageResponse {
  album: Album;
  images: ImageAlbumResponse[];

  constructor(album: Album, images: ImageAlbumResponse[]) {
    this.album = album;
    this.images = images;
  }
}
