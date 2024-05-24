import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';
import { InteractImageRequest } from './entity/request/InteractImageRequest';
import { DashboardImageService } from '../dashboard-image/DashboardImageService';
import { ProcessImageRequest } from './entity/request/ProcessImageRequest';
import { SearchPromptRequest } from './entity/request/SearchPromptRequest';
import { ImageResponseJson } from './entity/response/ImageResponseJson';
import { DashboardImageQueryRequest } from './entity/request/DashboardImageQueryRequest';
import { GenerateImageListResponseJson } from './entity/response/GenerateImageListResponseJson';

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
  ): Promise<ImageResponseJson[]> {
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
  async getUserImages(@User() user: UserFromAuthGuard): Promise<ImageResponseJson[]> {
    return this.imageService.handleGetImagesOfUser(user.id);
  }

  @Post('interact')
  @HttpCode(HttpStatus.OK)
  async interact(
    @User() user: UserFromAuthGuard,
    @Body() data: InteractImageRequest,
  ): Promise<string> {
    return this.imageService.handleInteractImage(user.id, data);
  }

  @Get('search-prompt')
  async searchPrompt(
    @Query() query_data: SearchPromptRequest,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    return this.imageService.handleSearchPrompt(query_data);
  }

  @Get('dashboard')
  async getDashboardImages(
    @Query() query_data: DashboardImageQueryRequest,
    @User() user: UserFromAuthGuard,
  ): Promise<Promise<QueryPaginationResponse<ImageResponseJson>>> {
    const image_filter = {
      aiName: query_data.aiName,
      style: query_data.style,
      imageType: query_data.imageType,
    };

    const pagination = {
      page: query_data.page,
      limit: query_data.limit,
    };

    return this.dashboardService.getImagesByType(
      query_data.type,
      user.id,
      pagination,
      image_filter,
    );
  }

  @Get('generate-history')
  async getGenerateHistoryImages(
    @User() user: UserFromAuthGuard,
  ): Promise<GenerateImageListResponseJson[]> {
    return this.imageService.handleGetGenerateImageHistory(user.id);
  }

  @Get(':imageId')
  async getImageById(@Param('imageId') image_id: number) {
    return this.imageService.handleGetImageById(image_id);
  }

  @Get('generate-history/:generationId')
  async getGeneratedImagesByGenerationId(
    @User() user: UserFromAuthGuard,
    @Param('generationId') generation_id: string,
  ): Promise<GenerateImageListResponseJson> {
    return this.imageService.handleGetGeneratedImagesByGenerationId(user.id, generation_id);
  }

  @Post('/:id/image-processing')
  async removeBackground(
    @User() user: UserFromAuthGuard,
    @Param('id') image_id: number,
    @Body() data: ProcessImageRequest,
  ): Promise<ImageResponseJson> {
    return this.imageService.handleImageProcessing(user.id, data.processType, image_id);
  }

  @Patch('visibility/:id')
  async changeVisibility(
    @User() user: UserFromAuthGuard,
    @Param('id') image_id: number,
  ): Promise<string> {
    await this.imageService.changeVisibilityImage(user.id, image_id);
    return ImageMessage.CHANGE_VISIBILITY_SUCCESS;
  }

  @Get('user/:userId')
  async getImageByUserId(
    @Param('userId') user_id: number,
    @Query() query_data: DashboardImageQueryRequest,
  ): Promise<Promise<QueryPaginationResponse<ImageResponseJson>>> {
    return this.imageService.handleGetImagesByUserId(user_id, {
      page: query_data.page,
      limit: query_data.limit,
    });
  }
}
