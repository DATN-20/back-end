import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { GenerateImageService } from './GenerateImageService';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async generateImageToImage(
    @User() user: UserFromAuthGuard,
    @UploadedFile() image: Express.Multer.File,
    @Body() generate_inputs: GenerateInputs,
  ) {
    generate_inputs.isUpscale = generate_inputs.isUpscale?.toString() === 'true';
    generate_inputs.image = image;
    return await this.generateImageService.handleGenerateImageToImage(user.id, generate_inputs);
  }
}
