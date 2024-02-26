import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { GenerateImageController } from '@core/module/generate-image/GenerateImageController';
import { GenerateImageService } from '@core/module/generate-image/GenerateImageService';
import { AIGenerateImageModule } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageModule';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, ImageStorageModule, AIGenerateImageModule],
  providers: [JwtUtil, GenerateImageService],
  controllers: [GenerateImageController],
  exports: [],
})
export class GenerateImageModule {}
