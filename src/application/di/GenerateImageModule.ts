import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { GenerateImageController } from '@core/module/generate-image/GenerateImageController';
import { GenerateImageService } from '@core/module/generate-image/GenerateImageService';
import { AIGenerateImageModule } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageModule';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { ImageModule } from './ImageModule';
import { AIGenerateImageByImagesStyleModule } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageByImagesStyleModule';
import { GenerationModule } from './GenerationModule';
import { BullModule } from '@nestjs/bull';
import { GENERATIONS_CHANNEL } from '@infrastructure/message-queue/QueueNameConstant';
import { GenerateImageConsumer } from '@core/module/generate-image/GenerateImageConsumer';

@Module({
  imports: [
    HttpModule,
    ImageStorageModule,
    AIGenerateImageModule,
    UserModule,
    ImageModule,
    AIGenerateImageByImagesStyleModule,
    GenerationModule,
    BullModule.registerQueue({
      name: GENERATIONS_CHANNEL,
    }),
  ],
  controllers: [GenerateImageController],
  providers: [JwtUtil, GenerateImageService, GenerateImageConsumer],
  exports: [],
})
export class GenerateImageModule {}
