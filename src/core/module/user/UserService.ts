import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { UserProfileResponse } from './entity/response/UserProfileResponse';
import { Exception } from '@core/common/exception/Exception';
import { UserError } from '@core/common/resource/error/UserError';
import { SocialRequest } from './entity/request/SocialRequest';

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

  async handleAddSocial(user_id: number, social: SocialRequest) {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    await this.userRepository.addSocial(user_id, social);

    const res = await this.userRepository.getById(user_id);
    return res;
  }
}
