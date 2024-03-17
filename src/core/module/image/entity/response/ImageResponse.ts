import { ImageType } from '@core/common/enum/ImageType';
import { Image } from '../Image';
import { ImageJson } from './ImageJson';

export class ImageResponse {
  private id: number;
  private userId: number;
  private url: string;
  private type: ImageType;
  private prompt: string;

  constructor(id: number, userId: number, url: string, type: ImageType, prompt: string) {
    this.id = id;
    this.userId = userId;
    this.url = url;
    this.type = type;
    this.prompt = prompt;
  }

  public static convertFromImage(image: Image) {
    return new ImageResponse(image.id, image.userId, image.url, image.type, image.prompt);
  }

  public toJson(): ImageJson {
    return {
      id: this.id,
      user_id: this.userId,
      url: this.url,
      type: this.type,
      prompt: this.prompt,
    };
  }

  public getUrl() {
    return this.url;
  }
}
