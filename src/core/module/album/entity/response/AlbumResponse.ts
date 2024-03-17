import { User } from '@core/module/user/entity/User';
import { Album } from '../Album';
import { Image } from '@core/module/image/entity/Image';
import { AlbumJson } from './AlbumJson';
import { UserInfoJson } from '@core/module/user/entity/response/UserInfoJson';

export class AlbumResponse {
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

  public createdUserInfo(): UserInfoJson {
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

  toJson(): AlbumJson {
    return {
      id: this.id,
      name: this.name,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      created_user: this.createdUserInfo(),
    };
  }
}
