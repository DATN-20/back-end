import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './AuthService';
import { CreateNewUserRequest } from './entity/request/CreateNewUserRequest';
import { LoginUserRequest } from './entity/request/LoginUserRequest';
import { AuthMessage } from '@core/common/resource/message/AuthMessage';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { TokenPayload } from '@core/common/util/jwt/JwtUtil';
import { ForgetPasswordRequest } from './entity/request/ForgetPasswordRequest';
import { ChangePasswordRequest } from './entity/request/ChangePasswordRequest';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() body: CreateNewUserRequest) {
    await this.authService.handleSignUp(body);

    return AuthMessage.SIGN_UP_SEND_MAIL_SUCCESSFULLY;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: LoginUserRequest) {
    const result = await this.authService.handleSignIn(body);

    return result.toJson();
  }

  @Post('signup/verify')
  @HttpCode(HttpStatus.OK)
  async verifySignUp(@Param('token') token: string) {
    await this.authService.handleActiveUserFromMail(token);

    return AuthMessage.SIGN_UP_SUCCESSFULLY;
  }

  @Post('signout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async signOut(@User() user: TokenPayload) {
    await this.authService.handleSignOut(user.id);

    return AuthMessage.SIGN_OUT_SUCCESSFULLY;
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() body: ForgetPasswordRequest) {
    await this.authService.handleForgetPassword(body.email);

    return AuthMessage.SEND_MAIL_VERIFY_FORGET_PASSWORD_SUCCESSFULLY;
  }

  @Post('forget-password/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() body: ChangePasswordRequest, @Param('token') token: string) {
    await this.authService.handleChangePassword(token, body.password);

    return AuthMessage.CHANGE_PASSWORD_SUCCESSFULLY;
  }
}
