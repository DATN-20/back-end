import { DateUtil } from '@core/common/util/DateUtil';
import { User } from '../User';
import { UserProfileResponseJson } from './UserProfileResponseJson';

export class UserProfileResponse {
  private firstName: string;
  private lastName: string;
  private aliasName: string;
  private phone: string;
  private address: string;
  private description: string;
  private socials: Social[];
  private role: string;
  private createdAt: string;
  private updatedAt: string;
  private avatar: string;
  private background: string;

  public static convertToResponseFromUserEntity(user: User): UserProfileResponse {
    const result = new UserProfileResponse();
    result.firstName = user.firstName;
    result.lastName = user.lastName;
    result.phone = user.phone;
    result.address = user.address;
    result.description = user.description;
    result.socials = user.socials;
    result.aliasName = user.aliasName;
    result.role = user.role;
    result.avatar = user.avatar;
    result.background = user.background;
    result.createdAt = DateUtil.formatDate(user.createdAt);
    result.updatedAt = DateUtil.formatDate(user.updatedAt);
    return result;
  }

  public toJson(): UserProfileResponseJson {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      address: this.address,
      description: this.description,
      socials: this.socials,
      alias_name: this.aliasName,
      role: this.role,
      avatar: this.avatar,
      background: this.background,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
