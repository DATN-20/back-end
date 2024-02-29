import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { GenerateImageService } from './GenerateImageService';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly generateImageService: GenerateImageService) {}

  @Get('/ai-info')
  async getAtInfo() {
    return this.generateImageService.handleGetAIInfo();
  }

  @Post('/text2img')
  async generateTextToImage(
    @User() user: UserFromAuthGuard,
    @Body() generate_inputs: GenerateInputs,
  ) {
    return await this.generateImageService.handleGenerateTextToImg(user.id, generate_inputs);
  }

  @Post('/image-to-image')
  @UseInterceptors(FileInterceptor('image'))
  async generateImageToImage(
    @User() user: UserFromAuthGuard,
    @UploadedFile() image: Express.Multer.File,
    @Body() generate_inputs: GenerateInputs,
  ) {
    generate_inputs.image = image;
    return await this.generateImageService.handleGenerateImageToImage(user.id, generate_inputs);
  }
}
