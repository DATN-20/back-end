import { AIGenerateImageServiceManger } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageServiceManager';
import { Injectable } from '@nestjs/common';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { ConverterUtil } from '@core/common/util/converter/ConverterUtil';
import { ImageService } from '../image/ImageService';
import { ImageType } from '@core/common/enum/ImageType';

@Injectable()
export class GenerateImageService {
  constructor(
    private aIGenerateImageServiceManger: AIGenerateImageServiceManger,
    private imageService: ImageService,
  ) {}

  async handleGenerateTextToImg(user_id: number, generate_inputs: GenerateInputs) {
    const input_promts = ConverterUtil.convertGenerateInputsToInputPromts(generate_inputs, user_id);
    const list_image_buffer = await this.aIGenerateImageServiceManger.generateTextToImage(
      generate_inputs.aiName,
      input_promts,
    );
    const list_image_response = await this.imageService.handleCreateGenerateImages(
      user_id,
      list_image_buffer,
      ImageType.TEXT_TO_IMG,
      input_promts,
    );
    const result = list_image_response.map(image => image.getUrl());
    return result;
  }

  async handleGenerateImageToImage(user_id: number, generate_inputs: GenerateInputs) {
    const input_promts = ConverterUtil.convertGenerateInputsToInputPromts(generate_inputs, user_id);
    const list_image_buffer = await this.aIGenerateImageServiceManger.generateImageToImage(
      generate_inputs.aiName,
      input_promts,
    );
    const list_image_response = await this.imageService.handleCreateGenerateImages(
      user_id,
      list_image_buffer,
      ImageType.TEXT_TO_IMG,
      input_promts,
    );

    const result = list_image_response.map(image => image.getUrl());
    console.log(list_image_response);
    return result;
  }

  async handleGetAIInfo() {
    return this.aIGenerateImageServiceManger.getAllAiInfo();
  }
}
