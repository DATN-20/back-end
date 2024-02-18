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
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@core/common/decorator/UserDecorator';
import { DeleteImageRequest } from './entity/Request/DeleteImageRequest';
import { ImageResponse } from './entity/Response/ImageResponse';
import { AuthGuard } from '@core/common/guard/AuthGuard';

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
  async deleteImages(@Body() images: DeleteImageRequest) {
    return this.imageService.handleDeleteImages(images.ids);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getUserImages(@User() user: number) {
    return this.imageService.handleGetImagesOfUser(user);
  }
}
