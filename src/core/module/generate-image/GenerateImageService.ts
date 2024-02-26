import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';

@Injectable()
export class GenerateImageService {
  constructor(
    @Inject('AIGenerateImageServiceManger')
    private aIGenerateImageServiceManger: AIGenerateImageServiceManger,
  ) {}

  async handleGenerateTextToImg(user_id: number, generate_inputs: GenerateInputs) {
    return this.aIGenerateImageServiceManger.generateTextToImage(
      generate_inputs.aiName,
      generate_inputs.convertToInputPrompts(user_id),
    );
  }
}
