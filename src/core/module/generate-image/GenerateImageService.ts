import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import { Injectable } from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { ConverterUtil } from '@core/common/util/converter/ConverterUtil';
import { AIGenerateImageByImagesStyleServiceManager } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageByImagesStyleServiceManager';
import { GenerateByImagesStyleInputs } from './entity/request/GenerateImageByImagesStyleInputs';

@Injectable()
export class GenerateImageService {
  constructor(
    private aIGenerateImageServiceManger: AIGenerateImageServiceManger,
    private aIGenerateImageByImagesStyleServiceManager: AIGenerateImageByImagesStyleServiceManager,
  ) {}

  async handleGenerateTextToImg(
    user_id: number,
    generate_inputs: GenerateInputs,
  ): Promise<Buffer[]> {
    const input_prompts = ConverterUtil.convertGenerateInputsToInputPromts(
      generate_inputs,
      user_id,
    );
    const list_image_buffer = await this.aIGenerateImageServiceManger.generateTextToImage(
      generate_inputs.aiName,
      input_prompts,
    );

    return list_image_buffer;
  }

  async handleGenerateImageToImage(
    user_id: number,
    generate_inputs: GenerateInputs,
  ): Promise<Buffer[]> {
    const input_prompts = ConverterUtil.convertGenerateInputsToInputPromts(
      generate_inputs,
      user_id,
    );
    const list_image_buffer = await this.aIGenerateImageServiceManger.generateImageToImage(
      generate_inputs.aiName,
      input_prompts,
    );

    return list_image_buffer;
  }

  async handleGetAIInfo(): Promise<any> {
    return this.aIGenerateImageServiceManger.getAllAIInfo();
  }

  async handleGenerateImageByImagesStyle(
    user_id: number,
    generate_inputs: GenerateByImagesStyleInputs,
  ): Promise<Buffer[]> {
    const input_prompts =
      ConverterUtil.convertGenerateByImagesStyleInputsToGenerateByImagesStyleInputPromts(
        generate_inputs,
        user_id,
      );

    const list_image_buffer =
      await this.aIGenerateImageByImagesStyleServiceManager.generateImageByImagesStyle(
        generate_inputs.aiName,
        input_prompts,
      );

    return list_image_buffer;
  }

  async handleGetAIGenerateByImagesStyleInfo(): Promise<any> {
    return this.aIGenerateImageByImagesStyleServiceManager.getAllAIInfo();
  }
}
