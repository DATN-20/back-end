import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { UserProfileResponse } from './entity/response/UserProfileResponse';
import { Exception } from '@core/common/exception/Exception';
import { UserError } from '@core/common/resource/error/UserError';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  async handleGetLoggedInUserProfile(user_id: number): Promise<UserProfileResponse> {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    return UserProfileResponse.convertToResponseFromUserEntity(matched_user);
  }
}
