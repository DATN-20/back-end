import { Injectable } from '@nestjs/common';
import { ComfyUIService } from './comfyui/ComfyUIService';
import { IAIFeatureService } from '@core/common/interface/IAIFeatureService';

@Injectable()
export class AIFeatureServiceManager {
  private aIList: { [key: string]: IAIFeatureService };

  constructor(private readonly comfyUIService: ComfyUIService) {
    this.aIList = {
      comfyUI: this.comfyUIService,
    };
  }

  async removeBackground(ai_name: string, image_buffer: Buffer): Promise<Buffer[]> {
    return this.aIList[ai_name].removeBackground(image_buffer);
  }

  async upscale(ai_name: string, image_buffer: Buffer): Promise<Buffer[]> {
    return this.aIList[ai_name].upscale(image_buffer);
  }

  async generateTagByImage(ai_name: string, image_buffer: Buffer): Promise<string> {
    return this.aIList[ai_name].generateTagByImage(image_buffer);
  }
}
