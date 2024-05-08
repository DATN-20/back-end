import { ImageType } from '@core/common/enum/ImageType';
import { Image } from '../Image';
import { User } from '@core/module/user/entity/User';
import { ImageResponseJson } from './ImageResponseJson';
import { UserResponseJson } from '@core/module/user/entity/response/UserResponseJson';

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
  private upscale: string;

  constructor(image: Image, user: User = null, likeNumber: number = 0, isLiked: boolean = false) {
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
    this.upscale = image.upscale ?? '';
  }

  public static convertFromImage(image: Image): ImageResponse {
    return new ImageResponse(image);
  }

  public createdUserInfo(): UserResponseJson {
    if (this.createdUser) {
      return {
        id: this.createdUser.id,
        first_name: this.createdUser.firstName,
        last_name: this.createdUser.lastName,
        alias_name: this.createdUser.aliasName,
        avatar: this.createdUser.avatar,
      };
    } else {
      return null;
    }
  }

  public toJson(): ImageResponseJson {
    return {
      id: this.id,
      url: this.url,
      type: this.type,
      prompt: this.prompt,
      ai_name: this.aiName,
      style: this.style,
      created_at: this.createdAt,
      created_user: this.createdUserInfo(),
      is_liked: this.isLiked,
      like_number: this.likeNumber,
      remove_background: this.removeBackground,
      upscale: this.upscale,
    };
  }

  public getUrl(): string {
    return this.url;
  }
}
