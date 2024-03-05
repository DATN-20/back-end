import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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

@UseGuards(AuthGuard)
@Controller('images')
export class ImageController {
  public constructor(private readonly imageService: ImageService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: number,
  ): Promise<ImageResponse[]> {
    return this.imageService.handleUploadImages(user, files);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteImages(@Body() images: DeleteImageRequest): Promise<string> {
    await this.imageService.handleDeleteImages(images.ids);
    return ImageMessage.DELETE_SUCCESS;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserImages(@User() user: number) {
    return this.imageService.handleGetImagesOfUser(user);
  }
}
