import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { UserProfileResponse } from './entity/response/UserProfileResponse';
import { Exception } from '@core/common/exception/Exception';
import { UserError } from '@core/common/resource/error/UserError';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { UserProfileResponseJson } from './entity/response/UserProfileResponseJson';
import { User } from './entity/User';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    @Inject('ImageStorageService') private readonly imageStorageService: IImageStorageService,
  ) {}

  async handleGetExistedUser(user_id: number): Promise<User> {
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user) {
      throw new Exception(UserError.USER_NOT_FOUND);
    }

    return matched_user;
  }

  async handleGetLoggedInUserProfile(user_id: number): Promise<UserProfileResponseJson> {
    const matched_user = await this.handleGetExistedUser(user_id);

    return UserProfileResponse.convertFromEntity(matched_user).toJson();
  }

  async handleUpdateProfile(
    user_id: number,
    profile: ProfileRequest,
  ): Promise<UserProfileResponseJson> {
    const matched_user = await this.handleGetExistedUser(user_id);

    ProfileRequest.updateFields(profile, matched_user);
    await this.userRepository.updateProfile(user_id, profile);

    profile.socials.forEach(async social => {
      await this.userRepository.addSocial(user_id, social);
    });

    const updated_user = await this.userRepository.getById(user_id);
    return UserProfileResponse.convertFromEntity(updated_user).toJson();
  }

  async handleAddSocial(user_id: number, social: SocialRequest): Promise<UserProfileResponseJson> {
    await this.handleGetExistedUser(user_id);
    await this.userRepository.addSocial(user_id, social);
    const updated_user = await this.userRepository.getById(user_id);
    return UserProfileResponse.convertFromEntity(updated_user).toJson();
  }

  async handleUpdateAvatar(user_id: number, file: Express.Multer.File): Promise<string> {
    await this.handleGetExistedUser(user_id);

    const { url: avatar } = await this.imageStorageService.uploadImageWithBuffer(file.buffer);

    try {
      await this.userRepository.updateAvatar(user_id, avatar);
      return avatar;
    } catch (error) {
      throw new Exception(UserError.FAILED_TO_UPDATE_AVATAR);
    }
  }

  async handleUpdateBackground(user_id: number, file: Express.Multer.File): Promise<string> {
    await this.handleGetExistedUser(user_id);

    const { url: background } = await this.imageStorageService.uploadImageWithBuffer(file.buffer);

    try {
      await this.userRepository.updateBackground(user_id, background);
      return background;
    } catch (error) {
      throw new Exception(UserError.FAILED_TO_UPDATE_BACKGROUND);
    }
  }
}
