import { UserProfileResponseJson } from '@core/module/user/entity/response/UserProfileResponseJson';
import { LockedUserJson } from './LockedUserJson';

export interface UserInformationResponseJson {
  user: UserProfileResponseJson;
  locked_information: LockedUserJson;
}
