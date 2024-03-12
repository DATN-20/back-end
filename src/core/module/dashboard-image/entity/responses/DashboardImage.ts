import { ImageResponse } from '../../../image/entity/response/ImageResponse';

export class DashboardImage {
  image: ImageResponse;
  like: number;

  constructor(image: ImageResponse, like: number) {
    this.image = image;
    this.like = like;
  }
}
