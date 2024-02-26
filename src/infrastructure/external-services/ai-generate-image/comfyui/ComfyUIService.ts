import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ComfyUISokcet } from '@core/module/ai-generate-image/socket/ComfyUISocket';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs'
import * as FormData from 'form-data';
import { Readable } from 'stream';
// import * as FormData from 'form-data';
@Injectable()
export class ComfyUIService implements IAIGenerateImageService {
  constructor(
    private httpService: HttpService,
    @Inject('ImageStorageService') private imageStorageService: IImageStorageService,
  ) { }

  async generateTextToImage(input_promts: InputPromts) { }

  generateImageToImage(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
  async getHistory(prompt_id: string) {
    const url = `http://${ComfyUIConfig.COMFYUI_URL}/history/${prompt_id}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
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

  async uploadImage(file: Express.Multer.File, name: string, image_type = 'input', overwrite = false) {
    const formRequest = new FormData;
    formRequest.append('image', Readable.from(file.buffer), {
      filename: file.originalname,
    });
    formRequest.append('type', image_type);
    formRequest.append('overwrite', String(overwrite).toLowerCase());

    try {
      const response = await this.httpService.axiosRef.post(`http://${ComfyUIConfig.COMFYUI_URL}/upload/image`, formRequest, {
        headers: {
          ...formRequest.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
  getImages(ws: WebSocket, prompt: string) {
    throw new Error('Method not implemented.');
  }
  async queuePrompt(prompt: string, clientId: string): Promise<any> {
    const payload = { prompt, client_id: clientId };
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await this.httpService.axiosRef.post(`http://${ComfyUIConfig.COMFYUI_URL}/prompt`, payload, { headers });
      return response.data;
    } catch (error) {
      console.error('Error queuing prompt:', error);
      throw error;
    }
  }

  convertToComfyUIPromptText2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptImg2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
}
