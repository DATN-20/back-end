import { AdminGuard } from '@core/common/guard/AdminGuard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserManagementService } from './UserManagementService';
import { LockUserRequest } from './entity/request/LockUserRequest';
import { UnlockUserRequest } from './entity/request/UnlockUserRequest';
import { LockedUserJson } from './entity/response/LockedUserJson';
import { LockedUserMessage } from '@core/common/resource/message/LockedUserMessage';
import { UserInformationResponseJson } from './entity/response/UserInformationResponseJson';
import { GetUsersQueryRequest } from './entity/request/GetUsersQueryRequest';
import { GetApiRequestTimesOfUserQuery } from './entity/request/GetApiRequestTimesOfUserQuery';
import { DateUtil } from '@core/common/util/DateUtil';
import { AnalysisWithQueryJson } from './entity/response/AnalysisWithDateJson';
import { AnalysisNewUserInRangeQuery } from './entity/request/AnalysisNewUserInRangeQuery';

@Controller('/management/users')
@UseGuards(AdminGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get()
  async getAllUser(
    @Query() query_data: GetUsersQueryRequest,
  ): Promise<QueryPaginationResponse<UserInformationResponseJson>> {
    return this.userManagementService.handleGetAllUser({
      page: query_data.page,
      limit: query_data.limit,
    });
  }

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

  @Get('analysis/new-user')
  async analysisNewUserInRange(
    @Query() query_data: AnalysisNewUserInRangeQuery,
  ): Promise<AnalysisWithQueryJson> {
    const { start_date, end_date } = query_data;
    DateUtil.validateRangeDate(start_date, end_date);
    const result = await this.userManagementService.handleAnalysisNewUserInRange(
      start_date,
      end_date,
    );

    return {
      start_date: start_date,
      end_date: end_date,
      data: result,
    };
  }

  @Get('api-request-times')
  async getApiRequestTimesOfUser(
    @Query() query_data: GetApiRequestTimesOfUserQuery,
  ): Promise<AnalysisWithQueryJson> {
    DateUtil.validateRangeDate(query_data.start_date, query_data.end_date);
    const result = await this.userManagementService.handleGetApiRequestTimesOfUser(
      query_data.user_id,
      query_data.endpoint,
      query_data.start_date,
      query_data.end_date,
    );

    return {
      start_date: query_data.start_date,
      end_date: query_data.end_date,
      endpoint: query_data.endpoint,
      data: result,
    };
  }
}
