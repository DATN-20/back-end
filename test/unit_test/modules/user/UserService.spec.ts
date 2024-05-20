import { UserRole } from '@core/common/enum/UserRole';
import { Exception } from '@core/common/exception/Exception';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { UserError } from '@core/common/resource/error/UserError';
import { ProfileRequest } from '@core/module/user/entity/request/ProfileRequest';
import { SocialRequest } from '@core/module/user/entity/request/SocialRequest';
import { UserProfileResponse } from '@core/module/user/entity/response/UserProfileResponse';
import { User } from '@core/module/user/entity/User';
import { UserRepository } from '@core/module/user/UserRepository';
import { UserService } from '@core/module/user/UserService';
import { CloudinaryService } from '@infrastructure/external-services/image-storage/cloudinary/CloudinaryService';
import { SINGLE_FILE_MOCK } from '../../core/utils/MockFile';
import { MockUserRepository } from '@unittest/core/mock-di/internal/repositories/UserRepositoryMock';
import { MockImageStorageService } from '@unittest/core/mock-di/internal/services/ImageStorageServiceMock';
import { UserMock } from '@unittest/core/mock-entity/UserMock';

const USER_ENTITY: User = {
  id: 1,
  password: '21312',
  firstName: 'sadas',
  lastName: 'sdas',
  aliasName: 'sadas',
  email: '2321@gmail.com',
  phone: '21312321312',
  address: '213213',
  description: 'asdas',
  socials: [],
  role: UserRole.ARTIST,
  background: null,
  avatar: null,
  accessToken: 'sadá',
  refeshToken: 'sđá',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let imageStorageService: IImageStorageService;
  let userEntityMock: UserMock;
  let userEntity: User;

  beforeAll(async () => {
    userRepository = MockUserRepository as UserRepository;
    imageStorageService = MockImageStorageService as CloudinaryService;
    userService = new UserService(userRepository, imageStorageService);
    userEntityMock = new UserMock();
    userEntity = userEntityMock.mock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleGetExistedUser', () => {
    it('should throw USER_NOT_FOUND exception', async () => {
      jest.spyOn(userRepository, 'getById').mockReturnValue(null);

      await expect(userService.handleGetLoggedInUserProfile(1)).rejects.toThrowError(
        new Exception(UserError.USER_NOT_FOUND),
      );
    });

    it('should return user entity', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(USER_ENTITY);

      await expect(userService.handleGetExistedUser(1)).resolves.toEqual(USER_ENTITY);
    });
  });

  describe('handleGetLoggedInUserProfile', () => {
    it('should return user profile', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(USER_ENTITY);

      await expect(userService.handleGetLoggedInUserProfile(1)).resolves.toEqual(
        UserProfileResponse.convertFromEntity(USER_ENTITY).toJson(),
      );
    });
  });

  describe('handleUpdateProfile', () => {
    it('should return user profile with updated information', async () => {
      const updated_user = {
        ...USER_ENTITY,
        socials: [
          {
            social_name: 'Facebook',
            social_link: 'https://facebook.com',
          },
          {
            social_name: 'Google',
            social_link: 'https://google.com',
          },
        ],
      };

      const updated_profile: ProfileRequest = {
        socials: [
          {
            socialName: 'Facebook',
            socialLink: 'https://facebook.com',
          },
          {
            socialName: 'Google',
            socialLink: 'https://google.com',
          },
        ],
        firstName: null,
        aliasName: null,
        lastName: null,
        phone: null,
        address: null,
        description: null,
      };

      jest.spyOn(userService, 'handleGetExistedUser').mockResolvedValue(USER_ENTITY);
      jest.spyOn(userRepository, 'getById').mockResolvedValue(updated_user);

      await expect(userService.handleUpdateProfile(1, updated_profile)).resolves.toEqual(
        UserProfileResponse.convertFromEntity(updated_user).toJson(),
      );
    });
  });

  describe('handleAddSocial', () => {
    it('shoud return user profile with new socials', async () => {
      const new_social: SocialRequest = {
        socialName: 'Facebook',
        socialLink: 'https://facebook.com',
      };
      const updated_user = {
        ...USER_ENTITY,
        socials: [
          ...USER_ENTITY.socials,
          {
            social_name: 'Facebook',
            social_link: 'https://facebook.com',
          },
        ],
      };

      jest.spyOn(userService, 'handleGetExistedUser').mockResolvedValue(USER_ENTITY);
      jest.spyOn(userRepository, 'getById').mockResolvedValue(updated_user);

      const actual_result = await userService.handleAddSocial(1, new_social);

      expect(userRepository.addSocial).toHaveBeenCalledWith(1, new_social);
      expect(actual_result).toEqual(UserProfileResponse.convertFromEntity(updated_user).toJson());
    });
  });

  describe('handleUpdateAvatar', () => {
    let url = 'https://abc.com/1.jpeg';
    beforeEach(() => {
      jest.spyOn(userService, 'handleGetExistedUser').mockResolvedValue(USER_ENTITY);
      jest.spyOn(imageStorageService, 'uploadImageWithBuffer').mockResolvedValue({
        url,
        id: 'sdasd',
      });
    });

    it('should throw FAILED_TO_UPDATE_AVATAR exception', async () => {
      jest.spyOn(userRepository, 'updateAvatar').mockImplementation(() => {
        throw new Exception(UserError.FAILED_TO_UPDATE_AVATAR);
      });

      await expect(userService.handleUpdateAvatar(1, SINGLE_FILE_MOCK)).rejects.toThrowError(
        new Exception(UserError.FAILED_TO_UPDATE_AVATAR),
      );
    });

    it('should update avatar and return avatar url', async () => {
      jest.spyOn(userRepository, 'updateAvatar').mockResolvedValue();

      await expect(userService.handleUpdateAvatar(1, SINGLE_FILE_MOCK)).resolves.toEqual(url);
    });
  });

  describe('handleUpdateBackground', () => {
    let url = 'https://abc.com/1.jpeg';

    beforeEach(() => {
      jest.spyOn(userService, 'handleGetExistedUser').mockResolvedValue(USER_ENTITY);
      jest.spyOn(imageStorageService, 'uploadImageWithBuffer').mockResolvedValue({
        url,
        id: 'sdasd',
      });
    });

    it('should throw FAILED_TO_UPDATE_BACKGROUND exception', async () => {
      jest.spyOn(userRepository, 'updateBackground').mockImplementation(() => {
        throw new Exception(UserError.FAILED_TO_UPDATE_BACKGROUND);
      });

      await expect(userService.handleUpdateBackground(1, SINGLE_FILE_MOCK)).rejects.toThrowError(
        new Exception(UserError.FAILED_TO_UPDATE_BACKGROUND),
      );
    });

    it('should update background and return background url', async () => {
      jest.spyOn(userRepository, 'updateBackground').mockResolvedValue();

      await expect(userService.handleUpdateBackground(1, SINGLE_FILE_MOCK)).resolves.toEqual(url);
    });
  });
});
