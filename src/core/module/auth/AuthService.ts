import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/UserRepository';
import { LoginUserRequest } from './entity/request/LoginUserRequest';
import { CreateNewUserRequest } from './entity/request/CreateNewUserRequest';
import { BcryptHash } from '@core/common/util/hash/BcryptHash';
import { Exception } from '@core/common/exception/Exception';
import { AuthError } from '@core/common/resource/error/AuthError';
import { CreateUserPayload, JwtType, JwtUtil, TokenPayload } from '@core/common/util/jwt/JwtUtil';
import { SignInResponse } from './entity/response/SignInResponse';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { MailTemplate } from '@core/common/enum/MailTemplate';
import { MailSubject } from '@core/common/enum/MailSubject';
import { FrontEndConfig } from '@infrastructure/config/FrontEndConfig';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: BcryptHash,
    private readonly jwtUtil: JwtUtil,
    private readonly mailService: MailService,
  ) {}

  async handleSignUp(data: CreateNewUserRequest): Promise<void> {
    const mail_matched_user = await this.userRepository.getByEmail(data.email);

    if (mail_matched_user) {
      throw new Exception(AuthError.MAIL_USED_BY_ANOTHER_USER);
    }

    const token_register = this.jwtUtil.signToken<CreateUserPayload>(data, JwtType.MAIL_SIGN_UP);
    await this.mailService.sendMail<string>(
      data.email,
      MailSubject.REGISTER_ACCOUNT,
      MailTemplate.REGISTER_ACCOUNT,
      `${FrontEndConfig.FRONT_END_URL}/verify?token=${token_register}`,
    );
  }

  async handleSignIn(data: LoginUserRequest): Promise<SignInResponse> {
    let user = await this.userRepository.getByEmail(data.email);

    if (!user) {
      throw new Exception(AuthError.WRONG_USERNAME_OR_PASSWORD);
    }

    const is_matched_password = await this.hashService.compare(data.password, user.password);

    if (!is_matched_password) {
      throw new Exception(AuthError.WRONG_USERNAME_OR_PASSWORD);
    }

    const access_token = this.jwtUtil.signToken<TokenPayload>(
      {
        id: user.id,
      },
      JwtType.ACCESS,
    );
    const refresh_token = this.jwtUtil.signToken<TokenPayload>(
      {
        id: user.id,
      },
      JwtType.REFRESH,
    );
    user = await this.userRepository.updateToken(user.id, access_token, refresh_token);

    return SignInResponse.convertFromUser(user);
  }

  async handleActiveUserFromMail(token: string): Promise<void> {
    const user_payload = this.jwtUtil.verify<CreateUserPayload>(token, JwtType.MAIL_SIGN_UP);

    if (!user_payload) {
      throw new Exception(AuthError.INVALID_VERIFY_TOKEN);
    }

    const hashed_password = await this.hashService.hash(user_payload.password);
    await this.userRepository.create({
      ...user_payload,
      password: hashed_password,
    });
  }

  async handleSignOut(id: number): Promise<void> {
    await this.userRepository.updateToken(id);
  }

  async handleForgetPassword(email: string): Promise<void> {
    const matched_user = await this.userRepository.getByEmail(email);

    if (!matched_user) {
      throw new Exception(AuthError.MAIL_NOT_MATCHED_WITH_ANY_USER);
    }

    const token_forget_password = this.jwtUtil.signToken<TokenPayload>(
      {
        id: matched_user.id,
      },
      JwtType.FORGET_PASSWORD,
    );

    await this.mailService.sendMail<{ name: string; token: string; url: string }>(
      matched_user.email,
      MailSubject.FORGET_PASSWORD,
      MailTemplate.FORGET_PASSWORD,
      {
        name: matched_user.firstName,
        token: token_forget_password,
        url: `${FrontEndConfig.FRONT_END_URL}/${FrontEndConfig.URL_PATTERN_FORGET_PASSWORD}?token=${token_forget_password}`,
      },
    );
  }

  async handleChangePassword(token: string, new_password: string): Promise<void> {
    const payload = this.jwtUtil.verify<TokenPayload>(token, JwtType.FORGET_PASSWORD);

    if (!payload) {
      throw new Exception(AuthError.INVALID_VERIFY_TOKEN);
    }

    await this.userRepository.updatePassword(payload.id, new_password);
  }

  async handleRefreshToken(token: string): Promise<SignInResponse> {
    const payload = this.jwtUtil.verify<TokenPayload>(token, JwtType.REFRESH);

    if (!payload) {
      throw new Exception(AuthError.INVALID_VERIFY_TOKEN);
    }

    let matched_user = await this.userRepository.getById(payload.id);

    if (matched_user.refeshToken !== token) {
      throw new Exception(AuthError.INVALID_TOKEN_USER);
    }

    const access_token = await this.jwtUtil.signToken<TokenPayload>(
      {
        id: matched_user.id,
      },
      JwtType.ACCESS,
    );
    const refresh_token = await this.jwtUtil.signToken<TokenPayload>(
      {
        id: matched_user.id,
      },
      JwtType.REFRESH,
    );
    matched_user = await this.userRepository.updateToken(
      matched_user.id,
      access_token,
      refresh_token,
    );

    return SignInResponse.convertFromUser(matched_user);
  }
}
