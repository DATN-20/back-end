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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './ImageService';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
import { ParamValidator } from '@core/common/util/ParamValidator';
import { QueryPaginationResponse } from '@core/common/type/Pagination';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserFromAuthGuard } from '@core/common/type/UserFromAuthGuard';
import { ProcessType } from './entity/ProcessType';

@ApiTags(ImageController.name.replaceAll('Controller', ''))
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('images')
export class ImageController {
  public constructor(
    private readonly imageService: ImageService,
    private readonly dashboardService: DashboardImageService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, type: ImageResponseJson, isArray: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserFromAuthGuard,
  ): Promise<ImageResponseJson[]> {
    return this.imageService.handleUploadImages(user.id, files);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteImages(@Body() images: DeleteImageRequest): Promise<string> {
    await this.imageService.handleDeleteImages(images.ids);
    return ImageMessage.DELETE_SUCCESS;
  }

  @ApiResponse({ status: HttpStatus.OK, type: ImageResponseJson, isArray: true })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserImages(@User() user: UserFromAuthGuard): Promise<ImageResponseJson[]> {
    return this.imageService.handleGetImagesOfUser(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Post('interact')
  @HttpCode(HttpStatus.OK)
  async interact(
    @User() user: UserFromAuthGuard,
    @Body() data: InteractImageRequest,
  ): Promise<string> {
    return this.imageService.handleInteractImage(user.id, data);
  }

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<ImageResponseJson> })
  @Get('search-prompt')
  async searchPrompt(
    @Query() query_data: SearchPromptRequest,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    return this.imageService.handleSearchPrompt(query_data);
  }

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<ImageResponseJson> })
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

  @ApiResponse({ status: HttpStatus.OK, type: GenerateImageListResponseJson, isArray: true })
  @Get('generate-history')
  async getGenerateHistoryImages(
    @User() user: UserFromAuthGuard,
  ): Promise<GenerateImageListResponseJson[]> {
    return this.imageService.handleGetGenerateImageHistory(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        processType: {
          type: 'string',
          enum: Object.values(ProcessType),
          default: ProcessType.UPSCALE,
        },
      },
      required: ['image', 'processType'],
    },
  })
  @Post('image-processing')
  @UseInterceptors(FileInterceptor('image'))
  async imageProcessingWithUploadedImage(
    @Body() data: ProcessImageRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.imageService.handleImageProcessingWithUploadedImage(data.processType, image.buffer);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ImageResponseJson })
  @Get(':imageId')
  async getImageById(
    @Param('imageId', ParamValidator) image_id: number,
  ): Promise<ImageResponseJson> {
    return this.imageService.handleGetImageById(image_id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: GenerateImageListResponseJson })
  @Get('generate-history/:generationId')
  async getGeneratedImagesByGenerationId(
    @User() user: UserFromAuthGuard,
    @Param('generationId', ParamValidator) generation_id: string,
  ): Promise<GenerateImageListResponseJson> {
    return this.imageService.handleGetGeneratedImagesByGenerationId(user.id, generation_id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ImageResponseJson })
  @Post(':imageId/image-processing')
  async imageProcessingWithExistedImage(
    @User() user: UserFromAuthGuard,
    @Param('imageId', ParamValidator) image_id: number,
    @Body() data: ProcessImageRequest,
  ): Promise<ImageResponseJson> {
    return this.imageService.handleImageProcessing(user.id, data.processType, image_id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Patch('visibility/:imageId')
  async changeVisibility(
    @User() user: UserFromAuthGuard,
    @Param('imageId', ParamValidator) image_id: number,
  ): Promise<string> {
    await this.imageService.changeVisibilityImage(user.id, image_id);
    return ImageMessage.CHANGE_VISIBILITY_SUCCESS;
  }

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<ImageResponseJson> })
  @Get('user/:userId')
  async getImageByUserId(
    @Param('userId', ParamValidator) user_id: number,
    @Query() query_data: DashboardImageQueryRequest,
  ): Promise<Promise<QueryPaginationResponse<ImageResponseJson>>> {
    return this.imageService.handleGetImagesByUserId(user_id, {
      page: query_data.page,
      limit: query_data.limit,
    });
  }
}
