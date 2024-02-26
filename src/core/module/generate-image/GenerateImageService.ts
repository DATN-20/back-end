import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { ConverterUtil } from '@core/common/util/converter/ConverterUtil';

@Injectable()
export class GenerateImageService {
  constructor(private aIGenerateImageServiceManger: AIGenerateImageServiceManger) {}

  async handleGenerateTextToImg(user_id: number, generate_inputs: GenerateInputs) {
    console.log(typeof generate_inputs);
    return this.aIGenerateImageServiceManger.generateTextToImage(
      generate_inputs.aiName,
      ConverterUtil.convertGenerateInputsToInputPromts(generate_inputs, user_id),
    );
  }
}
