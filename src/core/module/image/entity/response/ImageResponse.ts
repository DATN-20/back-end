import { ImageType } from '@core/common/enum/ImageType';
import { Image } from '../Image';

export class ImageResponse {
  private id: number;
  private userId: number;
  private url: string;
  private type: ImageType;
  private promp: string;

  constructor(id: number, userId: number, url: string, type: ImageType, promp: string) {
    this.id = id;
    this.userId = userId;
    this.url = url;
    this.type = type;
    this.promp = promp;
  }

  public static convertFromImage(image: Image) {
    return new ImageResponse(image.id, image.userId, image.url, image.type, image.promp);
  }

  public toJson() {
    return {
      id: this.id,
      user_id: this.userId,
      url: this.url,
      type: this.type,
      promp: this.promp,
    };
  }
}
