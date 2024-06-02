import { DateUnit } from '@core/common/enum/DateUnit';
import { UserRole } from '@core/common/enum/UserRole';
import { Exception } from '@core/common/exception/Exception';
import { DateUtil } from '@core/common/util/DateUtil';
import { BcryptHash } from '@core/common/util/hash/BcryptHash';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { AuthService } from '@core/module/auth/AuthService';
import { CreateNewUserRequest } from '@core/module/auth/entity/request/CreateNewUserRequest';
import { LoginUserRequest } from '@core/module/auth/entity/request/LoginUserRequest';
import { SignInResponse } from '@core/module/auth/entity/response/SignInResponse';
import { LockedUserRepository } from '@core/module/user-management/repositories/LockedUserRepository';
import { UserRepository } from '@core/module/user/UserRepository';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { MockLockedUserRepository } from '@unittest/core/mock-di/internal/repositories/LockedUserRepositoryMock';
import { MockUserRepository } from '@unittest/core/mock-di/internal/repositories/UserRepositoryMock';
import { MockBcryptHash } from '@unittest/core/mock-di/internal/services/BcryptHashMock';
import { MockMailService } from '@unittest/core/mock-di/internal/services/MailServiceMock';
import { MockJwtUtilL } from '@unittest/core/mock-di/internal/utils/JwtUtilMock';
import { LockedUserMock } from '@unittest/core/mock-entity/LockedUserMock';
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
  let lockedUserRepository: LockedUserRepository;
  let lockedUserEntityMock: LockedUserMock;

  beforeAll(() => {
    userRepository = MockUserRepository as UserRepository;
    hashService = MockBcryptHash as BcryptHash;
    jwtUtil = MockJwtUtilL as JwtUtil;
    mailService = MockMailService as MailService;
    lockedUserRepository = MockLockedUserRepository as LockedUserRepository;
    authService = new AuthService(
      userRepository,
      hashService,
      jwtUtil,
      mailService,
      lockedUserRepository,
    );
    userEntityMock = new UserMock();
    lockedUserEntityMock = new LockedUserMock();
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
        SignInResponse.convertFromUser(user).toJson(),
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
        role: UserRole.ARTIST,
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
        role: user.role,
      });
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      await expect(authService.handleRefreshToken(token)).rejects.toBeInstanceOf(Exception);
    });

    it('should return the pair token', async () => {
      const user = userEntityMock.mock();
      jest.spyOn(jwtUtil, 'verify').mockReturnValue({
        id: user.id,
        role: user.role,
      });
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'updateToken').mockResolvedValue(user);

      await expect(authService.handleRefreshToken(user.refeshToken)).resolves.toEqual(
        SignInResponse.convertFromUser(user).toJson(),
      );
    });
  });

  describe('handleLockedUser', () => {
    it('should return false if not found locked user', async () => {
      jest.spyOn(lockedUserRepository, 'getByUserId').mockResolvedValue(null);
      await expect(authService.handleLockedUser(1)).resolves.toEqual(false);
    });

    it('should return true if locked user is found and expired', async () => {
      const locked_users = lockedUserEntityMock.mock();
      jest.spyOn(lockedUserRepository, 'getByUserId').mockResolvedValue(locked_users);

      locked_users.expiredAt = DateUtil.subtractDate(new Date(), 10, DateUnit.DAYS);
      const actual_result = await authService.handleLockedUser(locked_users.userId);

      expect(lockedUserRepository.delete).toHaveBeenCalled();
      expect(actual_result).toEqual(true);
    });

    it('should throw exception if locked user is found and not expired', async () => {
      const locked_user = lockedUserEntityMock.mock();
      jest.spyOn(lockedUserRepository, 'getByUserId').mockResolvedValue(locked_user);

      await expect(authService.handleLockedUser(locked_user.userId)).rejects.toBeInstanceOf(
        Exception,
      );
    });
  });
});
