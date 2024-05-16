import { Module } from '@nestjs/common';
import { AIGenerateImageServiceManger } from './AIGenerateImageServiceManager';
import { ComfyUIModule } from './comfyui/ComfyUIModule';

@Module({
  imports: [ComfyUIModule],
  providers: [AIGenerateImageServiceManger],
  exports: [AIGenerateImageServiceManger],
})
export class AIGenerateImageModule {}
