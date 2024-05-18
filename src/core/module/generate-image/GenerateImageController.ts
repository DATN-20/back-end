import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { GenerateImageService } from './GenerateImageService';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GenerateByImagesStyleInputs } from './entity/request/GenerateImageByImagesStyleInputs';
import ApiLogger from '@core/common/logger/ApiLoggerService';
import { ImageType } from '@core/common/enum/ImageType';
import { CONTROL_NET_DEFAULT_STRENGTH } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/ComfyUIControlNetInfo';
import { GenerationService } from '../generation/GenerationService';
import { GenerationResponseJson } from '../generation/entity/response/GenerationResponseJson';

@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(
    private readonly generateImageService: GenerateImageService,
    private readonly generationService: GenerationService,
  ) {}

  @Get('/ai-info')
  async getAtInfo() {
    return this.generateImageService.handleGetAIInfo();
  }

  @Post('/text-to-image')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'controlNetImages', maxCount: 10 }]))
  async generateTextToImage(
    @User() user: UserFromAuthGuard,
    @UploadedFiles()
    data_images: { controlNetImages?: Express.Multer.File[] },
    @Body() generate_inputs: GenerateInputs,
  ): Promise<GenerationResponseJson> {
    ApiLogger.info(ImageType.TEXT_TO_IMG, {
      user_id: user.id,
      api_endpoint: '/generate-image/text-to-image',
    });
    generate_inputs.isUpscale ??= false;
    generate_inputs.controlNets ??= [];
    generate_inputs.controlNetImages = data_images?.controlNetImages;

    const generation = await this.generationService.handleCreateGenerationForUser(user.id);
    generate_inputs.generationId = generation.id;

    this.generateImageService
      .handleGenerateTextToImg(user.id, generate_inputs)
      .catch(async (_error: any) => {
        await this.generationService.handleDeleteById(generation.id);
      });

    return generation;
  }

  @Post('/image-to-image')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'controlNetImages', maxCount: 10 },
    ]),
  )
  async generateImageToImage(
    @User() user: UserFromAuthGuard,
    @UploadedFiles()
    data_images: { image: Express.Multer.File[]; controlNetImages?: Express.Multer.File[] },
    @Body() generate_inputs: GenerateInputs,
  ): Promise<GenerationResponseJson> {
    ApiLogger.info(ImageType.IMG_TO_IMG, {
      user_id: user.id,
      api_endpoint: '/generate-image/image-to-image',
    });
    generate_inputs.isUpscale ??= false;
    generate_inputs.image = data_images.image ? data_images.image[0] : null;
    generate_inputs.controlNetImages = data_images.controlNetImages;

    const generation = await this.generationService.handleCreateGenerationForUser(user.id);
    generate_inputs.generationId = generation.id;

    this.generateImageService
      .handleGenerateImageToImage(user.id, generate_inputs)
      .catch(async (_error: any) => {
        await this.generationService.handleDeleteById(generation.id);
      });

    return generation;
  }

  @Post('/image-by-images-style')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageToUnclipsImages', maxCount: 10 },
      { name: 'controlNetImages', maxCount: 10 },
      { name: 'imageForIpadapter', maxCount: 10 },
    ]),
  )
  async generateImageByImagesStyle(
    @User() user: UserFromAuthGuard,
    @Body() generate_inputs: GenerateByImagesStyleInputs,
    @UploadedFiles()
    files: {
      imageToUnclipsImages: Express.Multer.File[];
      imageForIpadapter: Express.Multer.File[];
      controlNetImages: Express.Multer.File[];
    },
  ): Promise<GenerationResponseJson> {
    ApiLogger.info(ImageType.IMG_BY_IMAGES_STYLE, {
      user_id: user.id,
      api_endpoint: '/generate-image/image-by-images-style',
    });
    //generate_inputs.imageToUnclipsImages = files.imageToUnclipsImages;
    generate_inputs.imageForIpadapters = files.imageForIpadapter;
    generate_inputs.controlNetImages = files.controlNetImages;
    const generation = await this.generationService.handleCreateGenerationForUser(user.id);
    generate_inputs.generationId = generation.id;

    this.generateImageService
      .handleGenerateImageByImagesStyle(user.id, generate_inputs)
      .catch(async (_error: any) => {
        await this.generationService.handleDeleteById(generation.id);
      });

    return generation;
  }

  @Get('/ai-generate-by-images-style-info')
  async getAIGenerateByImagesStyleInfo() {
    return this.generateImageService.handleGetAIGenerateByImagesStyleInfo();
  }
}
