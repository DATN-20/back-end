import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './ImageService';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@core/common/decorator/UserDecorator';
import { DeleteImageRequest } from './entity/request/DeleteImageRequest';
import { ImageResponse } from './entity/response/ImageResponse';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';
import { InteractImageRequest } from './entity/request/InteractImageRequest';
import { DashboardImageService } from '../dashboard-image/DashboardImageService';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';

@UseGuards(AuthGuard)
@Controller('images')
export class ImageController {
  public constructor(
    private readonly imageService: ImageService,
    private readonly dashboardService: DashboardImageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserFromAuthGuard,
  ): Promise<ImageResponse[]> {
    return this.imageService.handleUploadImages(user.id, files);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteImages(@Body() images: DeleteImageRequest): Promise<string> {
    await this.imageService.handleDeleteImages(images.ids);
    return ImageMessage.DELETE_SUCCESS;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserImages(@User() user: UserFromAuthGuard) {
    return this.imageService.handleGetImagesOfUser(user.id);
  }

  @Post('interact')
  @HttpCode(HttpStatus.OK)
  async interac(@User() user: UserFromAuthGuard, @Body() data: InteractImageRequest) {
    return await this.imageService.handleInteractImage(user.id, data);
  }

  @Get('dashboard')
  async getDashboardImages(
    @Query('type') type: DashboardImageType,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @User() user: UserFromAuthGuard,
  ) {
    const limit_number = parseInt(limit);
    const page_number = parseInt(page);

    return (
      await this.dashboardService.getImagesByType(type, limit_number, page_number, user.id)
    ).toJson();
  }

  @Get('generate-history')
  async getGenerateHistoryImages(@User() user: UserFromAuthGuard) {
    return this.imageService.handleGetGenerateImageHistory(user.id);
  }
}
