import { AdminGuard } from '@core/common/guard/AdminGuard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserManagementService } from './UserManagementService';
import { LockUserRequest } from './entity/request/LockUserRequest';
import { UnlockUserRequest } from './entity/request/UnlockUserRequest';
import { LockedUserJson } from './entity/response/LockedUserJson';
import { LockedUserMessage } from '@core/common/resource/message/LockedUserMessage';

@Controller('/management/users')
@UseGuards(AdminGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('lock')
  async lockUser(@Body() data: LockUserRequest): Promise<LockedUserJson> {
    return this.userManagementService.handleLockUser(data);
  }

  @Post('unlock')
  async unlockUser(@Body() data: UnlockUserRequest): Promise<string> {
    await this.userManagementService.handleUnlockUser(data.lockedUserId);

    return LockedUserMessage.UNLOCKED_USER_SUCCESSFULLY.replace(
      '%%id%%',
      data.lockedUserId.toString(),
    );
  }
}
