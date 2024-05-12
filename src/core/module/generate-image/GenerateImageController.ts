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

@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly generateImageService: GenerateImageService) {}

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
  ) {
    ApiLogger.info(ImageType.TEXT_TO_IMG, {
      user_id: user.id,
      api_endpoint: '/generate-image/text-to-image',
    });

    generate_inputs.isUpscale = generate_inputs.isUpscale?.toString() === 'true';
    generate_inputs.isUpscale ??= false;
    generate_inputs.controlNets ??= [];
    data_images.controlNetImages ??= [];

    if (data_images.controlNetImages.length > 0 && generate_inputs.controlNets.length > 0) {
      generate_inputs.controlNets = generate_inputs.controlNets.map((control_net, _index) => {
        return {
          controlNetType: control_net.controlNetType,
          image: data_images.controlNetImages[_index].buffer,
          strength: control_net.strength
            ? parseFloat(control_net.strength.toString())
            : CONTROL_NET_DEFAULT_STRENGTH,
          isPreprocessor: control_net.isPreprocessor
            ? control_net.isPreprocessor.toString() === 'true'
            : false,
        };
      });
    }

    return await this.generateImageService.handleGenerateTextToImg(user.id, generate_inputs);
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
  ) {
    ApiLogger.info(ImageType.IMG_TO_IMG, {
      user_id: user.id,
      api_endpoint: '/generate-image/image-to-image',
    });

    generate_inputs.isUpscale ??= false;
    generate_inputs.image = data_images.image ? data_images.image[0] : null;
    generate_inputs.controlNets ??= [];
    data_images.controlNetImages ??= [];

    if (data_images.controlNetImages.length > 0 && generate_inputs.controlNets.length > 0) {
      generate_inputs.controlNets = generate_inputs.controlNets.map((control_net, _index) => {
        return {
          controlNetType: control_net.controlNetType,
          image: data_images.controlNetImages[_index].buffer,
          strength: control_net.strength
            ? parseFloat(control_net.strength.toString())
            : CONTROL_NET_DEFAULT_STRENGTH,
          isPreprocessor: control_net.isPreprocessor
            ? control_net.isPreprocessor.toString() === 'true'
            : false,
        };
      });
    }

    return await this.generateImageService.handleGenerateImageToImage(user.id, generate_inputs);
  }

  @Post('/image-by-images-style')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imageToUnclipsImages', maxCount: 10 }]))
  async generateImageByImagesStyle(
    @User() user: UserFromAuthGuard,
    @Body() generate_inputs: GenerateByImagesStyleInputs,
    @UploadedFiles() files: { imageToUnclipsImages: Express.Multer.File[] },
  ) {
    ApiLogger.info(ImageType.IMG_BY_IMAGES_STYLE, {
      user_id: user.id,
      api_endpoint: '/generate-image/image-by-images-style',
    });

    generate_inputs.imageToUnclipsImages = files.imageToUnclipsImages;
    return await this.generateImageService.handleGenerateImageByImagesStyle(
      user.id,
      generate_inputs,
    );
  }

  @Get('/ai-generate-by-images-style-info')
  async getAIGenerateByImagesStyleInfo() {
    return this.generateImageService.handleGetAIGenerateByImagesStyleInfo();
  }
}
