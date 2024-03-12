import { ImageResponse } from '../../image/entity/Response/ImageResponse';

export class ImageData {
  image: ImageResponse;
  like: number;

  constructor(image: ImageResponse, like: number) {
    this.image = image;
    this.like = like;
  }
}
