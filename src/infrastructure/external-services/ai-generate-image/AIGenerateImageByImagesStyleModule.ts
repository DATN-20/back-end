import { Module } from '@nestjs/common';
import { ComfyUIModule } from './comfyui/ComfyUIModule';
import { AIGenerateImageByImagesStyleServiceManager } from './AIGenerateImageByImagesStyleServiceManager';

@Module({
  imports: [ComfyUIModule],
  providers: [AIGenerateImageByImagesStyleServiceManager],
  exports: [AIGenerateImageByImagesStyleServiceManager],
})
export class AIGenerateImageByImagesStyleModule {}
