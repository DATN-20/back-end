import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { GenerateImageService } from './GenerateImageService';

@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly generateImageService: GenerateImageService) {}

  @Get('/ai-info')
  async getAtInfo() {
    return this.generateImageService.handleGetAIInfo();
  }

  @Post('/text2img')
  async generateTextToImage(@User() user_id: number, @Body() generate_inputs: GenerateInputs) {
    return await this.generateImageService.handleGenerateTextToImg(user_id, generate_inputs);
  }

  @Post('/img-to-img')
  async generateImageToImage(@User() user_id: number, @Body() generate_inputs: GenerateInputs) {
    return await this.generateImageService.handleGenerateImageToImage(user_id, generate_inputs);
  }
}
