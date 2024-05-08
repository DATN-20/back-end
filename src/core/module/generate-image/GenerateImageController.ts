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
    generate_inputs.isUpscale = generate_inputs.isUpscale?.toString() === 'true';
    generate_inputs.image = data_images.image[0];

    if (data_images.controlNetImages) {
      data_images.controlNetImages.forEach((image, _index) => {
        generate_inputs.controlNets[_index].image = image.buffer;
        generate_inputs.controlNets[_index].strength = parseInt(
          generate_inputs.controlNets[_index].strength.toString(),
        );
        generate_inputs.controlNets[_index].isPreprocessor =
          generate_inputs.controlNets[_index].isPreprocessor.toString() === 'true';
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
