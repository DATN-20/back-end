import { UserProfileResponseJson } from '@core/module/user/entity/response/UserProfileResponseJson';
import { LockedUserJson } from './LockedUserJson';
import { ApiProperty } from '@nestjs/swagger';

export class UserInformationResponseJson {
  @ApiProperty()
  user: UserProfileResponseJson;
  @ApiProperty()
  locked_information: LockedUserJson;
}
