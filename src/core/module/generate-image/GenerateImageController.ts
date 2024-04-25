import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { GenerateImageService } from './GenerateImageService';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { GenerateByImagesStyleInputs } from './entity/request/GenerateImageByImagesStyleInputs';

@ApiTags('Api generate images')
@ApiBearerAuth()
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file and additional parameters for generating image to image',
    type: GenerateInputs,
  })
  async generateImageToImage(
    @User() user: UserFromAuthGuard,
    @UploadedFile() image: Express.Multer.File,
    @Body() generate_inputs: GenerateInputs,
  ) {
    generate_inputs.isUpscale = generate_inputs.isUpscale?.toString() === 'true';
    generate_inputs.image = image;
    return await this.generateImageService.handleGenerateImageToImage(user.id, generate_inputs);
  }

  @Post('/image-by-images-style')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imageToUnclipsImages', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file and additional parameters for generating image to image',
    type: GenerateByImagesStyleInputs,
  })
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
