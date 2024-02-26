import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { Body, Controller, Get, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ai-generate-image')
export class AIGenerateImageController {
  constructor(@Inject('ComfyUIService') private comfyUIService: IAIGenerateImageService) { }

  @Get()
  generateTextToImage() {
    this.comfyUIService.generateTextToImage({});
  }
  @Get('history/:prompt_id')
  async getHistory(@Param('prompt_id') prompt_id: string): Promise<any> {
    return this.comfyUIService.getHistory(prompt_id);
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<any> {
    const { name, image_type = 'input', overwrite = false } = body;

    try {
      const response = await this.comfyUIService.uploadImage(file, name, image_type, overwrite);
      return response;
    } catch (error) {
      console.error('Error in controller:', error);
      throw error;
    }
  }
}
