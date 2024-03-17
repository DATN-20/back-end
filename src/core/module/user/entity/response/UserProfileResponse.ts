import { DateUtil } from '@core/common/util/DateUtil';
import { User } from '../User';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponse {
  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public aliasName: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public address: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public socials: Social[];

  @ApiProperty()
  public role: string;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;

  public static convertToResponseFromUserEntity(user: User): UserProfileResponse {
    const result = new UserProfileResponse();
    result.firstName = user.firstName;
    result.lastName = user.lastName;
    result.phone = user.phone;
    result.address = user.address;
    result.description = user.description;
    result.socials = user.socials;
    result.role = user.role;
    result.createdAt = DateUtil.formatDate(user.createdAt);
    result.updatedAt = DateUtil.formatDate(user.updatedAt);

    return result;
  }
}
