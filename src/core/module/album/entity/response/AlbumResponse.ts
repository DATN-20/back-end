import { User } from '@core/module/user/entity/User';
import { Album } from '../Album';
import { Image } from '@core/module/image/entity/Image';
import { IResponse } from '@core/common/interface/IResponse';
import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';
import { AlbumResponseJson } from './AlbumResponseJson';
import { AlbumWithImagesResponseJson } from './AlbumWithImagesResponseJson';
import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';

export class AlbumResponse implements IResponse<AlbumResponseJson> {
  private id: number;
  private name: string;
  private createdAt: Date;
  private updatedAt: Date;
  private createdUser: User;
  private imageList: Image[];

  constructor(album: Album, create_user: User = null, image_list: Image[] = null) {
    this.id = album.id;
    this.name = album.name;
    this.createdAt = album.createdAt;
    this.updatedAt = album.updatedAt;
    this.createdUser = create_user;
    this.imageList = image_list;
  }

  public createdUserInfo(): UserShortProfileResponseJson {
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

  public toJson(): AlbumResponseJson {
    return {
      id: this.id,
      name: this.name,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      created_user: this.createdUserInfo(),
    };
  }

  public withImageToJson(): AlbumWithImagesResponseJson {
    return {
      album: this.toJson(),
      images: this.imageList.map(image => {
        return ImageResponse.convertFromImage(image).toJson();
      }),
    };
  }
}
