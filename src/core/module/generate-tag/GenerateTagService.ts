import { AIFeatureServiceManager } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceManager';
import { Injectable } from '@nestjs/common';
import { AI_FOR_GENERATE_TAG } from '@core/common/constant/Constant';
import { AIGenerateTagError } from '@core/common/resource/error/AIGenerateTagError';
import { Exception } from '@core/common/exception/Exception';

@Injectable()
export class GenerateTagService {
  constructor(private readonly aIFeatureServiceManager: AIFeatureServiceManager) {}

  async handleGenerateTag(image_buffer: Buffer): Promise<string> {
    if (image_buffer === undefined) {
      throw new Exception(AIGenerateTagError.IMAGE_IS_REQUIRED);
    }

    const tag = await this.aIFeatureServiceManager.generateTagByImage(
      AI_FOR_GENERATE_TAG,
      image_buffer,
    );

    return tag;
  }
}
