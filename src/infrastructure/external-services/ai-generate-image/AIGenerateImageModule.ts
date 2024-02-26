import { ComfyUIService } from '@infrastructure/external-services/ai-generate-image/comfyui/ComfyUIService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AIGenerateImageServiceManger } from './AIGenerateImageServiceManager';

@Module({
  imports: [HttpModule, ImageStorageModule],
  providers: [
    {
      provide: 'ComfyUIService',
      useClass: ComfyUIService,
    },
    AIGenerateImageServiceManger,
  ],
  exports: [AIGenerateImageServiceManger],
})
export class AIGenerateImageModule {}
