import { AIGenerateImageController } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageController';
import { ComfyUIService } from '@infrastructure/external-services/ai-generate-image/comfyui/ComfyUIService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, ImageStorageModule],
  providers: [
    {
      provide: 'ComfyUIService',
      useClass: ComfyUIService,
    },
  ],
  controllers: [AIGenerateImageController],
  exports: [],
})
export class AIGenerateImageModule {}
