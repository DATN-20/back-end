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

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lockedUserRepository: LockedUserRepository,
    private readonly mailService: MailService,
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

    return LockedUserResponse.convertFromLockedUserEntity(locked_user);
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
}
