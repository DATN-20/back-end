import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { RefreshTokenRequest } from './entity/request/RefreshTokenRequest';
import { SignInResponseJson } from './entity/response/SignInResponseJson';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(AuthController.name.replaceAll('Controller', ''))
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() body: CreateNewUserRequest): Promise<string> {
    await this.authService.handleSignUp(body);

    return AuthMessage.SIGN_UP_SEND_MAIL_SUCCESSFULLY;
  }

  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseJson })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: LoginUserRequest): Promise<SignInResponseJson> {
    return this.authService.handleSignIn(body);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Get('signup/verify')
  @HttpCode(HttpStatus.OK)
  async verifySignUp(@Query('token') token: string): Promise<string> {
    await this.authService.handleActiveUserFromMail(token);

    return AuthMessage.SIGN_UP_SUCCESSFULLY;
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('signout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async signOut(@User() user: TokenPayload): Promise<string> {
    await this.authService.handleSignOut(user.id);

    return AuthMessage.SIGN_OUT_SUCCESSFULLY;
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() body: ForgetPasswordRequest): Promise<string> {
    await this.authService.handleForgetPassword(body.email);

    return AuthMessage.SEND_MAIL_VERIFY_FORGET_PASSWORD_SUCCESSFULLY;
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('forget-password/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() data: ChangePasswordRequest): Promise<string> {
    await this.authService.handleChangePassword(data.token, data.password);

    return AuthMessage.CHANGE_PASSWORD_SUCCESSFULLY;
  }

  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseJson })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenRequest): Promise<SignInResponseJson> {
    return this.authService.handleRefreshToken(body.token);
  }
}
