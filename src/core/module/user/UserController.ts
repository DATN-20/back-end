import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { UserProfileResponse } from './entity/response/UserProfileResponse';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('me')
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard): Promise<UserProfileResponse> {
    return await this.userService.handleGetLoggedInUserProfile(user.id);
  }
  @Put('me')
  async updateProfile(
    @User() user: UserFromAuthGuard,
    @Body() profile: ProfileRequest,
  ): Promise<UserProfileResponse> {
    return await this.userService.handleUpdateProfile(user.id, profile);
  }
  @Post('me/social')
  async addSocial(
    @User() user: UserFromAuthGuard,
    @Body() social: SocialRequest,
  ): Promise<UserProfileResponse> {
    return await this.userService.handleAddSocial(user.id, social);
  }
}
