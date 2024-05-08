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
import { InputControlnet } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/InputControlnet';

@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly generateImageService: GenerateImageService) {}

  @Get('/ai-info')
  async getAtInfo() {
    return this.generateImageService.handleGetAIInfo();
  }

  @Post('/text-to-image')
  async generateTextToImage(
    @User() user: UserFromAuthGuard,
    @Body() generate_inputs: GenerateInputs,
  ) {
    generate_inputs.isUpscale = generate_inputs.isUpscale?.toString() === 'true';
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
    generate_inputs.isUpscale ??= false;
    generate_inputs.image = data_images.image[0];
    generate_inputs.controlNets ??= [];
    data_images.controlNetImages ??= [];

    if (data_images.controlNetImages.length > 0 && generate_inputs.controlNets.length > 0) {
      generate_inputs.controlNets = generate_inputs.controlNets.map((control_net, _index) => {
        return {
          controlNetType: control_net.controlNetType,
          image: data_images.controlNetImages[_index].buffer,
          strength: control_net.strength ? parseInt(control_net.strength.toString()) : 1,
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
