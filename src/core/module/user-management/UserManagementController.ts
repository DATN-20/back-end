import { AdminGuard } from '@core/common/guard/AdminGuard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserManagementService } from './UserManagementService';
import { LockUserRequest } from './entity/request/LockUserRequest';
import { UnlockUserRequest } from './entity/request/UnlockUserRequest';
import { LockedUserJson } from './entity/response/LockedUserJson';
import { LockedUserMessage } from '@core/common/resource/message/LockedUserMessage';
import { UserInformationResponseJson } from './entity/response/UserInformationResponseJson';
import { GetUsersQueryRequest } from './entity/request/GetUsersQueryRequest';
import ApiLogger from '@core/common/logger/ApiLoggerService';

@Controller('/management/users')
// @UseGuards(AdminGuard)
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

  @Get()
  async getAllUser(
    @Query() query_data: GetUsersQueryRequest,
  ): Promise<QueryPaginationResponse<UserInformationResponseJson>> {
    ApiLogger.info('access to api', { user_id: 1, api_endpoint: '/management/users' });
    return this.userManagementService.handleGetAllUser({
      page: query_data.page,
      limit: query_data.limit,
    });
  }
}
