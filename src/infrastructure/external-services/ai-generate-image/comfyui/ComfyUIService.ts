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

  async generateTextToImage(input_promts: InputPromts): Promise<string[]> {
    const comfyui_socket = new ComfyUISokcet();
    const comfyui_prompt = this.convertToComfyUIPromptText2Img(input_promts);
    const result = await this.getImages(comfyui_socket, comfyui_prompt);

    return result;
  }

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

  async getImages(web_socket: ComfyUISokcet, prompt: string) {
    const prompt_id = await this.queuePrompt(prompt)['prompt_id'];

    return new Promise<string[]>((resolve, reject) => {
      web_socket.getExecutedResultFromMessage(prompt_id, async (output_images) => {
        const list_image_url = [];
        console.log(output_images);

        for (const image_data of output_images) {
          const image_url = await this.getImage(
            image_data.filename,
            image_data.type,
            image_data.subfolder,
          );

          list_image_url.push(image_url);
        }

        resolve(list_image_url);
      });
    });
  }

  async queuePrompt(prompt: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptText2Img(input_promts: InputPromts): string {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptImg2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
}
