import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { SocialRequest } from './entity/request/SocialRequest';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('me')
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard) {
    return await this.userService.handleGetLoggedInUserProfile(user.id);
  }

  @Post('me/social')
  async addSocial(@User() user: UserFromAuthGuard, @Body() social: SocialRequest) {
    return await this.userService.handleAddSocial(user.id, social);
  }
}
