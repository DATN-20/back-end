import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './UserService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { UserProfileResponse } from './entity/response/UserProfileResponse';
import { Express } from 'express';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('me')
  async getLoggedInUserProfile(@User() user: UserFromAuthGuard): Promise<UserProfileResponse> {
    return await this.userService.handleGetLoggedInUserProfile(user.id);
  }

  @Get(':id')
  async getUserProfile(@Param('id') user_id: number): Promise<UserProfileResponse> {
    return this.userService.handleGetUserProfileById(user_id);
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
