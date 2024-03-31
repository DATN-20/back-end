import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { UserProfileResponse } from './entity/response/UserProfileResponse';
import { Exception } from '@core/common/exception/Exception';
import { UserError } from '@core/common/resource/error/UserError';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';

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
  async handleUpdateProfile(
    user_id: number,
    profile: ProfileRequest,
  ): Promise<UserProfileResponse> {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }
    await this.userRepository.updateProfile(user_id, profile);
    profile.socials.forEach(async social => {
      await this.userRepository.addSocial(user_id, social);
    });
    const res = await this.userRepository.getById(user_id);
    return UserProfileResponse.convertToResponseFromUserEntity(res);
  }
  async handleAddSocial(user_id: number, social: SocialRequest): Promise<UserProfileResponse> {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    await this.userRepository.addSocial(user_id, social);
    const res = await this.userRepository.getById(user_id);
    return UserProfileResponse.convertToResponseFromUserEntity(res);
  }
}
