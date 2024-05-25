import { UserModule } from './UserModule';
import { GenerateTagService } from '@core/module/generate-tag/GenerateTagService';
import { GenerateTagController } from '@core/module/generate-tag/GenerateTagController';
import { Module } from '@nestjs/common';
import { AIFeatureServiceModule } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceModule';

@Module({
  imports: [AIFeatureServiceModule, UserModule],
  controllers: [GenerateTagController],
  providers: [GenerateTagService],
  exports: [GenerateTagService],
})
export class GenerateTagModule {}
