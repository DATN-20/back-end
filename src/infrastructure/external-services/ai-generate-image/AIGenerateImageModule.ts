import { ComfyUIService } from '@infrastructure/external-services/ai-generate-image/comfyui/ComfyUIService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AIGenerateImageServiceManger } from './AIGenerateImageServiceManager';
import { ComfyUIModule } from './comfyui/ComfyUIModule';

@Module({
  imports: [ComfyUIModule],
  providers: [AIGenerateImageServiceManger],
  exports: [AIGenerateImageServiceManger],
})
export class AIGenerateImageModule {}
