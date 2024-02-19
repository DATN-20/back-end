import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('ai-generate-image')
export class AIGenerateImageController {
  constructor(@Inject('ComfyUIService') private comfyUIService: IAIGenerateImageService) {}

  @Get()
  generateTextToImage() {
    this.comfyUIService.generateTextToImage({});
  }
}
