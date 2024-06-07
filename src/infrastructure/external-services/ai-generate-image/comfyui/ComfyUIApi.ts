import { Exception } from '@core/common/exception/Exception';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';
import { EnvironmentConverter } from '@core/common/util/converter/EnvironmentConverter';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { ComfyUISokcet } from './ComfyUISocket';
import { OutputPropertyWebSocket } from './ComfyUIConstant';

@Injectable()
export class ComfyUIApi {
  constructor(private readonly httpService: HttpService) {}

  async getHistory(prompt_id: string): Promise<any> {
    const url = `${EnvironmentConverter.convertUrlInSuitableEnvironment(
      ComfyUIConfig.COMFYUI_URL,
    )}/history/${prompt_id}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      throw new Exception(AIGenerateImageError.COMFYUI_ERROR);
    }
  }

  async getImage(filename: string, folder_type: string, subfolder = ''): Promise<Buffer> {
    const { data } = await this.httpService.axiosRef.get(
      `${EnvironmentConverter.convertUrlInSuitableEnvironment(ComfyUIConfig.COMFYUI_URL)}/view`,
      {
        params: {
          filename,
          subfolder,
          type: folder_type,
        },
        responseType: 'arraybuffer',
      },
    );

    return data;
  }

  async uploadImage(
    buffer: Buffer,
    file_name: string,
    image_type = 'input',
    overwrite = false,
  ): Promise<ComfyUIUploadImageResponse> {
    try {
      const form_request = new FormData();
      form_request.append('image', Buffer.from(buffer), {
        filename: file_name,
      });
      form_request.append('type', image_type);
      form_request.append('overwrite', String(overwrite).toLowerCase());

      const response = await this.httpService.axiosRef.post(
        `${EnvironmentConverter.convertUrlInSuitableEnvironment(
          ComfyUIConfig.COMFYUI_URL,
        )}/upload/image`,
        form_request,
        {
          headers: {
            ...form_request.getHeaders(),
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Exception(AIGenerateImageError.COMFYUI_ERROR);
    }
  }

  async getImages(web_socket: ComfyUISokcet, prompt: object): Promise<Buffer[]> {
    const prompt_id = await this.queuePrompt(prompt, web_socket.getClientId());

    return new Promise<Buffer[]>((resolve, reject) => {
      web_socket.getExecutedResultFromMessage(
        prompt_id,
        OutputPropertyWebSocket.IMAGES,
        async output_images => {
          const list_image_buffer = [];

          for (const image_data of output_images) {
            const image_buffer = await this.getImage(
              image_data.filename,
              image_data.type,
              image_data.subfolder,
            );

            list_image_buffer.push(image_buffer);
          }

          resolve(list_image_buffer);
        },
      );
    });
  }

  async getTags(web_socket: ComfyUISokcet, prompt: object): Promise<string> {
    const prompt_id = await this.queuePrompt(prompt, web_socket.getClientId());

    return new Promise<string>((resolve, reject) => {
      web_socket.getExecutedResultFromMessage(
        prompt_id,
        OutputPropertyWebSocket.TAGS,
        async output_tags => {
          resolve(output_tags[0]);
        },
      );
    });
  }

  async queuePrompt(prompt: any, client_id: string): Promise<string> {
    const payload = { prompt, client_id: client_id };
    const headers = { 'Content-Type': 'application/json' };
    try {
      const response = await this.httpService.axiosRef.post(
        `${EnvironmentConverter.convertUrlInSuitableEnvironment(ComfyUIConfig.COMFYUI_URL)}/prompt`,
        payload,
        { headers },
      );

      return response.data.prompt_id;
    } catch (error) {
      throw new Exception(AIGenerateImageError.COMFYUI_ERROR);
    }
  }
}
