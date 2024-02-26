import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { ComfyUIService } from './comfyui/ComfyUIService';
import { Injectable } from '@nestjs/common';
import { InputPromts } from './type/InputPrompts';
import { Exception } from '@core/common/exception/Exception';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';

@Injectable()
export class AIGenerateImageServiceManger {
  private aIList: { [key: string]: IAIGenerateImageService };

  constructor(private readonly comfyUIService: ComfyUIService) {
    this.aIList = {
      comfyUI: comfyUIService,
    };
  }

  async generateTextToImage(aIName: string, input_promts: InputPromts) {
    this.CheckAIValid(aIName);
    return this.aIList[aIName].generateTextToImage(input_promts);
  }

  async generateImageToImage(aiName: string, input_promts: InputPromts) {
    this.CheckAIValid(aiName);
    return this.aIList[aiName].generateImageToImage(input_promts);
  }

  CheckAIValid(aIname) {
    if (!(aIname in this.aIList)) {
      throw new Exception(AIGenerateImageError.INVALID_AI_NAME);
    }
  }

  async getAllAiInfo() {
    const result = [];

    for (const key in this.aIList) {
      if (this.aIList.hasOwnProperty(key)) {
        const value = this.aIList[key];
        const ai_info = value.getAIInfo();
        result.push(ai_info);
      }
    }

    return result;
  }
}
