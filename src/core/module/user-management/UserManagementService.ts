import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/UserRepository';
import { LockedUserRepository } from './repositories/LockedUserRepository';
import { LockUserRequest } from './entity/request/LockUserRequest';
import { LockedUserJson } from './entity/response/LockedUserJson';
import { Exception } from '@core/common/exception/Exception';
import { UserError } from '@core/common/resource/error/UserError';
import { LockedUserResponse } from './entity/response/LockedUserResponse';
import { LockedUserError } from '@core/common/resource/error/LockedUserError';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { MailSubject } from '@core/common/enum/MailSubject';
import { MailTemplate } from '@core/common/enum/MailTemplate';
import { UserInformationResponseJson } from './entity/response/UserInformationResponseJson';
import { UserInformationResponse } from './entity/response/UserInformationResponse';
import { UserProfileResponse } from '../user/entity/response/UserProfileResponse';
import { MyElasticsearchService } from '@infrastructure/external-services/elasticsearch/ElasticsearchService';
import { AnalysisWithDateJson } from './entity/response/AnalysisWithDateJson';
import { DateUtil } from '@core/common/util/DateUtil';
import { DateUnit } from '@core/common/enum/DateUnit';
import { QueryPagination, QueryPaginationResponse } from '@core/common/type/Pagination';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lockedUserRepository: LockedUserRepository,
    private readonly mailService: MailService,
    private readonly elasticsearchService: MyElasticsearchService,
  ) {}

  async handleLockUser(data: LockUserRequest): Promise<LockedUserJson> {
    const matched_user = await this.userRepository.getById(data.lockedUserId);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    const matched_locked_user = await this.lockedUserRepository.getByUserId(data.lockedUserId);

    if (matched_locked_user) {
      throw new Exception(LockedUserError.USER_IS_LOCKED(matched_locked_user.lockedAt));
    }

    const locked_user = await this.lockedUserRepository.create(
      matched_user.id,
      data.type,
      data.period,
      data.unit,
    );

    this.mailService.sendMail(
      matched_user.email,
      MailSubject.LOCKED_USER,
      MailTemplate.LOCKED_USER,
      {
        name: matched_user.firstName,
        ...locked_user,
      },
    );

    return LockedUserResponse.convertFromLockedUserEntity(locked_user).toJson();
  }

  async handleUnlockUser(user_id: number): Promise<void> {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    const matched_locked_user = await this.lockedUserRepository.getByUserId(user_id);
    if (!matched_locked_user) {
      throw new Exception(LockedUserError.USER_IS_NOT_LOCKED);
    }

    this.mailService.sendMail(
      matched_user.email,
      MailSubject.UNLOCKED_USER,
      MailTemplate.UNLOCKED_USER,
      {
        name: matched_user.firstName,
      },
    );

    await this.lockedUserRepository.delete(user_id);
  }

  async handleGetAllUser(
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<UserInformationResponseJson>> {
    const users = await this.userRepository.getAll(pagination);
    const total_record = (await this.userRepository.getAll()).length;

    const converted_users = users.map(user_information => {
      if (user_information.lockedInformation) {
        return UserInformationResponse.convertFromUserWithLockedInformation(
          user_information,
        ).toJson();
      }

      return {
        user: UserProfileResponse.convertFromEntity(user_information.user).toJson(),
        locked_information: null,
      };
    });

    return {
      limit: pagination.limit ?? Number.MAX_SAFE_INTEGER,
      page: pagination.page ?? 0,
      total: total_record,
      data: converted_users,
    };
  }

  async handleAnalysisNewUserInRange(
    start_date: Date,
    end_date: Date,
  ): Promise<AnalysisWithDateJson[]> {
    let processing_date = start_date;
    let result: AnalysisWithDateJson[] = [];

    while (processing_date <= end_date) {
      const analysis_processing_date = await this.userRepository.countNewUserInDate(
        processing_date,
      );
      result.push({
        date: processing_date,
        total: analysis_processing_date,
      });

      processing_date = DateUtil.addDate(processing_date, 1, DateUnit.DAYS);
    }

    return result;
  }

  async handleGetApiRequestTimesOfUser(
    user_id: number,
    endpoint: string,
    start_date: Date,
    end_date: Date,
  ): Promise<AnalysisWithDateJson[]> {
    let processing_date = start_date;
    let result: AnalysisWithDateJson[] = [];

    while (processing_date <= end_date) {
      const analysis_processing_date = await this.elasticsearchService.countLogsForSpecificUser(
        user_id,
        endpoint,
        processing_date,
      );

      result.push({
        date: processing_date,
        total: analysis_processing_date,
      });

      processing_date = DateUtil.addDate(processing_date, 1, DateUnit.DAYS);
    }

    return result;
  }
}
