import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { Express } from 'express';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileResponseJson } from './entity/response/UserProfileResponseJson';
import { ParamValidator } from '@core/common/util/ParamValidator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(UserController.name.replaceAll('Controller', ''))
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponseJson })
  @Get('me')
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard): Promise<UserProfileResponseJson> {
    return this.userService.handleGetLoggedInUserProfile(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponseJson })
  @Get(':guestId')
  async getUserProfile(
    @Param('guestId', ParamValidator)
    guest_id: number,
  ): Promise<UserProfileResponseJson> {
    return this.userService.handleGetUserProfileById(guest_id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponseJson })
  @Put('me')
  async updateProfile(
    @User() user: UserFromAuthGuard,
    @Body() profile: ProfileRequest,
  ): Promise<UserProfileResponseJson> {
    return this.userService.handleUpdateProfile(user.id, profile);
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserProfileResponseJson })
  @Post('me/social')
  async addSocial(
    @User() user: UserFromAuthGuard,
    @Body() social: SocialRequest,
  ): Promise<UserProfileResponseJson> {
    return this.userService.handleAddSocial(user.id, social);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @User() user: UserFromAuthGuard,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.userService.handleUpdateAvatar(user.id, file);
  }
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @UseInterceptors(FileInterceptor('file'))
  @Post('me/background')
  async updateBackground(
    @User() user: UserFromAuthGuard,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.userService.handleUpdateBackground(user.id, file);
  }
}
