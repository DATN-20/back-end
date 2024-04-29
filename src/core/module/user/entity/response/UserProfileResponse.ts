import { DateUtil } from '@core/common/util/DateUtil';
import { User } from '../User';

export class UserProfileResponse {
  public firstName: string;
  public lastName: string;
  public aliasName: string;
  public phone: string;
  public address: string;
  public description: string;
  public socials: Social[];
  public role: string;
  public createdAt: string;
  public updatedAt: string;
  public avatar: string;
  public background: string;

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
}
