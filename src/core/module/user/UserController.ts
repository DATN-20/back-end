import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
