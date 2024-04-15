import { Injectable } from '@nestjs/common';
import { ComfyUIService } from './comfyui/ComfyUIService';
import { IAIFeatureService } from '@core/common/interface/IAIFeatureService';

@Injectable()
export class AIFeatureServiceManager {
  private aIList: { [key: string]: IAIFeatureService };

  constructor(private readonly comfyUIService: ComfyUIService) {
    this.aIList = {
      comfyUI: comfyUIService,
    };
  }

  async removeBackground(ai_name: string, image_buffer: Buffer): Promise<Buffer[]> {
    return this.aIList[ai_name].removeBackground(image_buffer);
  }
}
