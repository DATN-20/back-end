import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ComfyUISokcet } from '@core/module/ai-generate-image/socket/ComfyUISocket';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ComfyUIService implements IAIGenerateImageService {
  constructor(
    private httpService: HttpService,
    @Inject('ImageStorageService') private imageStorageService: IImageStorageService,
  ) {}

  async generateTextToImage(input_promts: InputPromts) {}

  generateImageToImage(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
  getHistory(prompt_id: string) {
    throw new Error('Method not implemented.');
  }

  async getImage(filename: string, folder_type: string, subfolder: string = ''): Promise<string> {
    const { data } = await this.httpService.axiosRef.get(
      `https://${ComfyUIConfig.COMFYUI_URL}/view`,
      {
        params: {
          filename,
          subfolder,
          type: folder_type,
        },
        responseType: 'arraybuffer',
      },
    );

    const image = await this.imageStorageService.uploadImageWithBuffer(data);

    return image.url;
  }

  uploadImage() {
    throw new Error('Method not implemented.');
  }
  getImages(ws: WebSocket, prompt: string) {
    throw new Error('Method not implemented.');
  }
  queuePrompt(prompt: string) {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptText2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptImg2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
}
