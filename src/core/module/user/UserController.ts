import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { UserProfileResponse } from './entity/response/UserProfileResponse';

@ApiTags('Api users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponse })
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard): Promise<UserProfileResponse> {
    return await this.userService.handleGetLoggedInUserProfile(user.id);
  }
  @Put('me')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponse })
  async updateProfile(
    @User() user: UserFromAuthGuard,
    @Body() profile: ProfileRequest,
  ): Promise<UserProfileResponse> {
    return await this.userService.handleUpdateProfile(user.id, profile);
  }
  @Post('me/social')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponse })
  async addSocial(
    @User() user: UserFromAuthGuard,
    @Body() social: SocialRequest,
  ): Promise<UserProfileResponse> {
    return await this.userService.handleAddSocial(user.id, social);
  }
}
