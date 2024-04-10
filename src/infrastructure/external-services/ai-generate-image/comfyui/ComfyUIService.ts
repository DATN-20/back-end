import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { Injectable } from '@nestjs/common';
import { ComfyUIInfo } from './ComfyUIInfo';
import { ComfyUISokcet } from './ComfyUISocket';
import { ComfyUIConverter } from './ComfyUIConverter';
import { ComfyUIValidator } from './ComfyUIValidator';
import { ComfyUIApi } from './ComfyUIApi';
import { ComfyUIFeature } from './ComfyUIFeature';

@Injectable()
export class ComfyUIService implements IAIGenerateImageService {
  private info: ComfyUIInfo;

  constructor(
    private readonly comfyUIConverter: ComfyUIConverter,
    private readonly comfyUIValidator: ComfyUIValidator,
    private readonly comfyUIApi: ComfyUIApi,
    private readonly comfyUIFeature: ComfyUIFeature,
  ) {
    this.info = new ComfyUIInfo();
  }

  async generateTextToImage(input_promts: InputPromts): Promise<Buffer[]> {
    this.comfyUIValidator.textToImagePromptValidate(this.info, input_promts);
    const comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptText2Img(input_promts);
    const comfyui_socket = new ComfyUISokcet();
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  async generateImageToImage(input_promts: InputPromts): Promise<Buffer[]> {
    this.comfyUIValidator.imageToImagePromptValidate(this.info, input_promts);
    let comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptImg2Img(input_promts);

    const comfyui_socket = new ComfyUISokcet();
    await this.comfyUIApi.uploadImage(input_promts.image.buffer, input_promts.filename);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  getAIInfo() {
    return {
      ai_name: 'comfyUI',
      inputs: Object.values(this.info.inputs).map(input => JSON.parse(input.toJson())),
    };
  }
}
