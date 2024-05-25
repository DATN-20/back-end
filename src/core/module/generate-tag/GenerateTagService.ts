import { ConverterUtil } from '@core/common/util/converter/ConverterUtil';
import { AIFeatureServiceManager } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceManager';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateInputs } from '../generate-image/entity/request/GenerateInputs';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { GenerateTagInput } from './entity/request/GenerateTagInput';
import { AI_FOR_GENERATE_TAG } from '@core/common/constant/Constant';
import { AIGenerateTagError } from '@core/common/resource/error/AIGenerateTagError';
import { Exception } from '@core/common/exception/Exception';

@Injectable()
export class GenerateTagService {
  constructor(private readonly aIFeatureServiceManager: AIFeatureServiceManager) {}

  async handleGenerateTag(generate_inputs: GenerateTagInput): Promise<string> {
    if (generate_inputs.image === undefined) {
      throw new Exception(AIGenerateTagError.IMAGE_NOT_FOUND);
    }
    const tag = await this.aIFeatureServiceManager.generateTagByImage(
      AI_FOR_GENERATE_TAG,
      generate_inputs.image.buffer,
    );

    return tag;
  }
}
