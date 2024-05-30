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

  async generateTextToImage(ai_name: string, input_promts: InputPromts): Promise<Buffer[]> {
    this.checkAIValid(ai_name);
    return this.aIList[ai_name].generateTextToImage(input_promts);
  }

  async generateImageToImage(ai_name: string, input_promts: InputPromts): Promise<Buffer[]> {
    this.checkAIValid(ai_name);
    return this.aIList[ai_name].generateImageToImage(input_promts);
  }

  checkAIValid(ai_name: string): boolean {
    if (!(ai_name in this.aIList)) {
      throw new Exception(AIGenerateImageError.INVALID_AI_NAME);
    }

    return true;
  }

  async getAllAIInfo(): Promise<any> {
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
