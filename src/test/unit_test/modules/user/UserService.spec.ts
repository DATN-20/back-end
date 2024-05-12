import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { UserModule } from '@application/di/UserModule';
import { UserRole } from '@core/common/enum/UserRole';
import { Exception } from '@core/common/exception/Exception';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { UserError } from '@core/common/resource/error/UserError';
import { UserProfileResponse } from '@core/module/user/entity/response/UserProfileResponse';
import { User } from '@core/module/user/entity/User';
import { UserRepository } from '@core/module/user/UserRepository';
import { UserService } from '@core/module/user/UserService';
import { CloudinaryService } from '@infrastructure/external-services/image-storage/cloudinary/CloudinaryService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { Test } from '@nestjs/testing';

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

  beforeEach(async () => {
    const mockUserRepository: Partial<UserRepository> = {
      getById: jest.fn(),
    };

    userRepository = mockUserRepository as UserRepository;
    imageStorageService = {} as CloudinaryService;
    userService = new UserService(userRepository, imageStorageService);
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
        UserProfileResponse.convertToResponseFromUserEntity(USER_ENTITY),
      );
    });
  });
});
