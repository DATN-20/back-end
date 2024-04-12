import { ImageType } from '@core/common/enum/ImageType';
import { Image } from '../Image';
import { User } from '@core/module/user/entity/User';

export class ImageResponse {
  private id: number;
  private userId: number;
  private url: string;
  private type: ImageType;
  private prompt: string;
  private aiName: string;
  private style: string;
  private createdAt: Date;
  private createdUser: User;
  private likeNumber: number;
  private isLiked: boolean;
  private removeBackground: string;

  constructor(image: Image, user: User = null, likeNumber = null, isLiked: boolean = false) {
    this.id = image.id;
    this.userId = image.userId;
    this.url = image.url;
    this.type = image.type;
    this.prompt = image.prompt;
    this.aiName = image.aiName;
    this.style = image.style;
    this.createdAt = image.createdAt;
    this.createdUser = user;
    this.isLiked = isLiked;
    this.likeNumber = likeNumber;
    this.removeBackground = image.removeBackground ?? '';
  }

  public static convertFromImage(image: Image) {
    return new ImageResponse(image);
  }

  public createdUserInfo() {
    if (this.createdUser) {
      return {
        id: this.createdUser.id,
        first_name: this.createdUser.firstName,
        last_name: this.createdUser.lastName,
        alias_name: this.createdUser.aliasName,
      };
    } else {
      return null;
    }
  }

  public toJson() {
    return {
      id: this.id,
      url: this.url,
      type: this.type,
      promp: this.prompt,
      ai_name: this.aiName,
      style: this.style,
      created_at: this.createdAt,
      created_user: this.createdUserInfo(),
      is_liked: this.isLiked,
      like_number: this.likeNumber,
      remove_background: this.removeBackground,
    };
  }

  public getUrl() {
    return this.url;
  }
}
