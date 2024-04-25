import { Exception } from '@core/common/exception/Exception';
import { IAIGenerateImageByImagesStyleService } from '@core/common/interface/IAIGenerateImageByImagesStyleService';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';
import { Injectable } from '@nestjs/common';
import { ComfyUIService } from './comfyui/ComfyUIService';
import { GenerateByImagesStyleInputPromts } from './type/GenerateByImagesStyleInputPromts';

@Injectable()
export class AIGenerateImageByImagesStyleServiceManager {
  private aIList: { [key: string]: IAIGenerateImageByImagesStyleService };

  constructor(private readonly comfyUIService: ComfyUIService) {
    this.aIList = {
      comfyUI: comfyUIService,
    };
  }

  CheckAIValid(ai_name) {
    if (!(ai_name in this.aIList)) {
      throw new Exception(AIGenerateImageError.INVALID_AI_NAME);
    }
  }

  async getAllAiInfo() {
    const result = [];

    for (const key in this.aIList) {
      if (this.aIList.hasOwnProperty(key)) {
        const value = this.aIList[key];
        const ai_info = value.getAIGenerateImageByImagesStyleInfo();
        result.push(ai_info);
      }
    }

    return result;
  }

  async generateImageByImagesStyle(
    ai_name: string,
    input_prompts: GenerateByImagesStyleInputPromts,
  ) {
    this.CheckAIValid(ai_name);
    return this.aIList[ai_name].generateImageByImagesStyle(input_prompts);
  }
}
