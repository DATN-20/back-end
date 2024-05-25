import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { UserProfileResponseJson } from './entity/response/UserProfileResponseJson';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('me')
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard): Promise<UserProfileResponseJson> {
    return await this.userService.handleGetLoggedInUserProfile(user.id);
  }

  @Get(':guestId')
  async getUserProfile(
    @Param(
      'guestId',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new Exception(ErrorBaseSystem.INVALID_PARAM('guestId'));
        },
      }),
    )
    guest_id: number,
  ): Promise<UserProfileResponseJson> {
    return this.userService.handleGetUserProfileById(guest_id);
  }

  @Put('me')
  async updateProfile(
    @User() user: UserFromAuthGuard,
    @Body() profile: ProfileRequest,
  ): Promise<UserProfileResponseJson> {
    return await this.userService.handleUpdateProfile(user.id, profile);
  }

  @Post('me/social')
  async addSocial(
    @User() user: UserFromAuthGuard,
    @Body() social: SocialRequest,
  ): Promise<UserProfileResponseJson> {
    return await this.userService.handleAddSocial(user.id, social);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @User() user: UserFromAuthGuard,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.userService.handleUpdateAvatar(user.id, file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('me/background')
  async updateBackground(
    @User() user: UserFromAuthGuard,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.userService.handleUpdateBackground(user.id, file);
  }
}
