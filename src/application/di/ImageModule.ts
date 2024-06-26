import { ImageController } from '@core/module/image/ImageController';
import { ImageRepository } from '@core/module/image/ImageRepository';
import { ImageService } from '@core/module/image/ImageService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { ImageInteractionModule } from './ImageInteractionModule';
import { DashboardImageModule } from './DashboardImageModule';
import { ComfyUIModule } from '@infrastructure/external-services/ai-generate-image/comfyui/ComfyUIModule';
import { AIFeatureServiceModule } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceModule';

@Module({
  imports: [
    ComfyUIModule,
    ImageStorageModule,
    UserModule,
    ImageInteractionModule,
    DashboardImageModule,
    AIFeatureServiceModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
