import { AIFeatureServiceManager } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceManager';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { UserModule } from './UserModule';
import { ImageModule } from './ImageModule';
import { GenerationModule } from './GenerationModule';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { GenerateTagService } from '@core/module/generate-tag/GenerateTagService';
import { GenerateTagController } from '@core/module/generate-tag/GenerateTagController';
import { Module } from '@nestjs/common';
import { AIFeatureServiceModule } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceModule';

@Module({
  imports: [AIFeatureServiceModule, ImageStorageModule, UserModule, ImageModule],
  providers: [JwtUtil, GenerateTagService],
  controllers: [GenerateTagController],
  exports: [],
})
export class GenerateTagModule {}
