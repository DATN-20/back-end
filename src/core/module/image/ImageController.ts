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
import { DashboardResponse } from '../dashboard-image/entity/response/DashboardResponse';
import {
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Api images')
@ApiBearerAuth()
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: Array<File>,
  })
  @ApiResponse({ status: HttpStatus.OK, type: Array<ImageResponse> })
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserFromAuthGuard,
  ): Promise<ImageResponse[]> {
    return this.imageService.handleUploadImages(user.id, files);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async deleteImages(@Body() images: DeleteImageRequest): Promise<string> {
    await this.imageService.handleDeleteImages(images.ids);
    return ImageMessage.DELETE_SUCCESS;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: Array<ImageResponse> })
  async getUserImages(@User() user: UserFromAuthGuard): Promise<ImageResponse[]> {
    return this.imageService.handleGetImagesOfUser(user.id);
  }

  @Post('interact')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async interact(
    @User() user: UserFromAuthGuard,
    @Body() data: InteractImageRequest,
  ): Promise<string> {
    return await this.imageService.handleInteractImage(user.id, data);
  }

  @Get('dashboard')
  @ApiQuery({ name: 'type', required: false, description: 'Type of images to retrieve' })
  @ApiQuery({ name: 'limit', required: true, description: 'Number of images per page' })
  @ApiQuery({ name: 'page', required: true, description: 'Page number' })
  @ApiResponse({ status: HttpStatus.OK, type: DashboardResponse })
  async getDashboardImages(
    @Query('type') type: DashboardImageType,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<DashboardResponse> {
    const limit_number = parseInt(limit);
    const page_number = parseInt(page);
    return await this.dashboardService.getImagesByType(type, limit_number, page_number);
  }
}
