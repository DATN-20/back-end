import { Exception } from '@core/common/exception/Exception';
import { AuthError } from '@core/common/resource/error/AuthError';
import { BcryptHash } from '@core/common/util/hash/BcryptHash';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { AuthService } from '@core/module/auth/AuthService';
import { CreateNewUserRequest } from '@core/module/auth/entity/request/CreateNewUserRequest';
import { LoginUserRequest } from '@core/module/auth/entity/request/LoginUserRequest';
import { SignInResponse } from '@core/module/auth/entity/response/SignInResponse';
import { UserRepository } from '@core/module/user/UserRepository';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { MockUserRepository } from '@unittest/core/mock-di/internal/repositories/UserRepositoryMock';
import { MockBcryptHash } from '@unittest/core/mock-di/internal/services/BcryptHashMock';
import { MockMailService } from '@unittest/core/mock-di/internal/services/MailServiceMock';
import { MockJwtUtilL } from '@unittest/core/mock-di/internal/utils/JwtUtilMock';
import { UserMock } from '@unittest/core/mock-entity/UserMock';
import { RandomNumber } from '@unittest/core/utils/RandomNumber';
import { RandomString } from '@unittest/core/utils/RandomString';

describe(AuthService.name, () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let hashService: BcryptHash;
  let jwtUtil: JwtUtil;
  let mailService: MailService;
  let userEntityMock: UserMock;

  beforeAll(() => {
    userRepository = MockUserRepository as UserRepository;
    hashService = MockBcryptHash as BcryptHash;
    jwtUtil = MockJwtUtilL as JwtUtil;
    mailService = MockMailService as MailService;
    authService = new AuthService(userRepository, hashService, jwtUtil, mailService);
    userEntityMock = new UserMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleSignUp', () => {
    let createNewUserRequest: CreateNewUserRequest;

    beforeAll(() => {
      createNewUserRequest = {
        email: 'test@gmail.com',
        firstName: RandomString.randomString(),
        lastName: RandomString.randomString(),
        password: RandomString.randomString(),
      } as CreateNewUserRequest;
    });

    it('should throw MAIL_USED_BY_ANOTHER_USER exception', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(userEntityMock.mock());

      await expect(authService.handleSignUp(createNewUserRequest)).rejects.toBeInstanceOf(
        Exception,
      );
    });

    it('should send mail verify', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
      jest.spyOn(jwtUtil, 'signToken').mockReturnValue(RandomString.randomString());
      await authService.handleSignUp(createNewUserRequest);

      expect(mailService.sendMail).toBeCalledTimes(1);
    });
  });

  describe('handleSignIn', () => {
    let loginUserRequest: LoginUserRequest;
    beforeAll(() => {
      loginUserRequest = {
        email: 'test@gmail.com',
        password: RandomString.randomString(),
      } as LoginUserRequest;
    });

    it('should throw WRONG_USERNAME_OR_PASSWORD exception', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
      await expect(authService.handleSignIn(loginUserRequest)).rejects.toBeInstanceOf(Exception);
    });

    it('should throw WRONG_USERNAME_OR_PASSWORD exception', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(hashService, 'compare').mockResolvedValue(false);

      await expect(authService.handleSignIn(loginUserRequest)).rejects.toBeInstanceOf(Exception);
    });

    it('should return the pair token', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(hashService, 'compare').mockResolvedValue(true);
      jest.spyOn(userRepository, 'updateToken').mockResolvedValue(user);

      await expect(authService.handleSignIn(loginUserRequest)).resolves.toEqual(
        SignInResponse.convertFromUser(user),
      );
    });
  });

  describe('handleActiveUserFromMail', () => {
    let token: string;
    beforeAll(() => {
      token = RandomString.randomString();
    });

    it('should throw INVALID_VERIFY_TOKEN exception', async () => {
      jest.spyOn(jwtUtil, 'verify').mockReturnValue(null);
      await expect(authService.handleActiveUserFromMail(token)).rejects.toBeInstanceOf(Exception);
    });

    it('should create user if token is valid', async () => {
      jest.spyOn(jwtUtil, 'verify').mockReturnValue({
        email: `${RandomString.randomString()}@gmail.com`,
        firstName: RandomString.randomString(),
        lastName: RandomString.randomString(),
        password: RandomString.randomString(),
      });

      await authService.handleActiveUserFromMail(token);
      expect(userRepository.create).toBeCalledTimes(1);
    });
  });

  describe('handleSignOut', () => {
    it('should sign out', async () => {
      await authService.handleSignOut(1);
      expect(userRepository.updateToken).toBeCalledTimes(1);
    });
  });

  describe('handleForgetPassword', () => {
    let email: string;
    beforeAll(() => {
      email = `${RandomString.randomString()}@gmail.com`;
    });

    it('should throw MAIL_NOT_MATCHED_WITH_ANY_USER exception', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
      await expect(authService.handleForgetPassword(email)).rejects.toBeInstanceOf(Exception);
    });

    it('should send verify mail', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(userEntityMock.mock());

      await authService.handleForgetPassword(email);
      expect(mailService.sendMail).toBeCalledTimes(1);
    });
  });

  describe('handleChangePassword', () => {
    let token: string;
    let email: string;
    beforeAll(() => {
      token = RandomString.randomString();
      email = RandomString.randomString();
    });

    it('should throw INVALID_VERIFY_TOKEN exception', async () => {
      jest.spyOn(jwtUtil, 'verify').mockReturnValue(null);
      await expect(authService.handleChangePassword(token, email)).rejects.toBeInstanceOf(
        Exception,
      );
    });

    it('should update password if token is valid', async () => {
      jest.spyOn(jwtUtil, 'verify').mockReturnValue({
        id: RandomNumber.randomNumber(),
      });

      await authService.handleChangePassword(token, email);
      expect(userRepository.updatePassword).toBeCalledTimes(1);
    });
  });

  describe('handleRefreshToken', () => {
    let token: string;
    beforeAll(() => {
      token = RandomString.randomString();
    });

    it('should throw INVALID_VERIFY_TOKEN exception', async () => {
      jest.spyOn(jwtUtil, 'verify').mockReturnValue(null);
      await expect(authService.handleRefreshToken(token)).rejects.toBeInstanceOf(Exception);
    });

    it('should update password if token is valid', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(jwtUtil, 'verify').mockReturnValue({
        id: user.id,
      });
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      await expect(authService.handleRefreshToken(token)).rejects.toBeInstanceOf(Exception);
    });

    it('should return the pair token', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(jwtUtil, 'verify').mockReturnValue({
        id: user.id,
      });
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'updateToken').mockResolvedValue(user);

      await expect(authService.handleRefreshToken(user.refeshToken)).resolves.toEqual(
        SignInResponse.convertFromUser(user),
      );
    });
  });
});
