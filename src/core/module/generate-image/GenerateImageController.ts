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

    const generation = await this.generationService.handleCreateGenerationForUser(user.id);
    generate_inputs.generationId = generation.id;

    this.generateImageService.handleGenerateTextToImg(user.id, generate_inputs).then(data => {});

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
  ) {
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

    return this.generateImageService.handleGenerateImageToImage(user.id, generate_inputs);
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
    },
  ) {
    //generate_inputs.imageToUnclipsImages = files.imageToUnclipsImages;
    generate_inputs.imageForIpadapters = files.imageForIpadapter;
    return this.generateImageService.handleGenerateImageByImagesStyle(user.id, generate_inputs);
  }

  @Get('/ai-generate-by-images-style-info')
  async getAIGenerateByImagesStyleInfo() {
    return this.generateImageService.handleGetAIGenerateByImagesStyleInfo();
  }
}
