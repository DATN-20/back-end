import { User, UserWithLockedInformation } from '@core/module/user/entity/User';
import { LockedUser } from '../LockedUser';
import { UserInformationResponseJson } from './UserInformationResponseJson';
import { UserProfileResponse } from '@core/module/user/entity/response/UserProfileResponse';
import { LockedUserResponse } from './LockedUserResponse';
import { IResponse } from '@core/common/interface/IResponse';

export class UserInformationResponse implements IResponse<UserInformationResponseJson> {
  private user: User;
  private lockedInformation: LockedUser;

  constructor(user: User, locked_information: LockedUser) {
    this.user = user;
    this.lockedInformation = locked_information;
  }

  public static convertFromUserWithLockedInformation(
    user_with_locked_information: UserWithLockedInformation,
  ): UserInformationResponse {
    return new UserInformationResponse(
      user_with_locked_information.user,
      user_with_locked_information.lockedInformation,
    );
  }

  public toJson(): UserInformationResponseJson {
    return {
      user: UserProfileResponse.convertFromEntity(this.user).toJson(),
      locked_information: LockedUserResponse.convertFromLockedUserEntity(
        this.lockedInformation,
      ).toJson(),
    };
  }
}
