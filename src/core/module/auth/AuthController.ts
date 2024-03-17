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
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthResponseJson } from './entity/response/AuthResponseJson';

@ApiTags('Api auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async signUp(@Body() body: CreateNewUserRequest): Promise<string> {
    await this.authService.handleSignUp(body);

    return AuthMessage.SIGN_UP_SEND_MAIL_SUCCESSFULLY;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseJson })
  async signIn(@Body() body: LoginUserRequest): Promise<AuthResponseJson> {
    const result = await this.authService.handleSignIn(body);

    return result.toJson();
  }

  @Get('signup/verify')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async verifySignUp(@Query('token') token: string): Promise<string> {
    await this.authService.handleActiveUserFromMail(token);

    return AuthMessage.SIGN_UP_SUCCESSFULLY;
  }

  @Post('signout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async signOut(@User() user: TokenPayload): Promise<string> {
    await this.authService.handleSignOut(user.id);

    return AuthMessage.SIGN_OUT_SUCCESSFULLY;
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async forgetPassword(@Body() body: ForgetPasswordRequest): Promise<string> {
    await this.authService.handleForgetPassword(body.email);

    return AuthMessage.SEND_MAIL_VERIFY_FORGET_PASSWORD_SUCCESSFULLY;
  }

  @Post('forget-password/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async changePassword(
    @Body() body: ChangePasswordRequest,
    @Param('token') token: string,
  ): Promise<string> {
    await this.authService.handleChangePassword(token, body.password);

    return AuthMessage.CHANGE_PASSWORD_SUCCESSFULLY;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseJson })
  async refreshToken(@Body() body: RefreshTokenRequest): Promise<AuthResponseJson> {
    const result = await this.authService.handleRefreshToken(body.token);

    return result.toJson();
  }
}
