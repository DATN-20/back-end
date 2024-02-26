import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ComfyUISokcet } from '@core/module/ai-generate-image/socket/ComfyUISocket';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { stringify } from 'querystring';
import { ComfyUIInfo } from './ComfyUIInfo';
import { Exception } from '@core/common/exception/Exception';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';
import { GenerateInput } from '../type/GenerateInput/GenerateInput';

@Injectable()
export class ComfyUIService implements IAIGenerateImageService {
  constructor(
    private httpService: HttpService,
    @Inject('ImageStorageService') private imageStorageService: IImageStorageService,
  ) {}

  private jsonFilePath = './workflow-json-files/';
  private info = new ComfyUIInfo();

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
    this.textToImagePromptValidate(input_promts);
    const workflow_data = fs.readFileSync(this.jsonFilePath + 'text2img.json', {
      encoding: 'utf-8',
    });
    const workflow = JSON.parse(workflow_data);

    workflow['1']['inputs']['ckpt_name'] = input_promts.style;
    workflow['2']['inputs']['text'] = input_promts.positivePrompt;
    workflow['3']['inputs']['text'] = input_promts.negativePrompt;
    workflow['8']['inputs']['width'] = input_promts.width;
    workflow['8']['inputs']['height'] = input_promts.height;
    workflow['8']['inputs']['batch_size'] = input_promts.numberOfImage;
    if (input_promts.seed != null) {
      workflow['9']['inputs']['seed'] = input_promts.seed;
    } else {
      const seed = Math.floor(Math.random() * 1000000000) + 1;
      workflow['9']['inputs']['seed'] = seed;
    }
    workflow['9']['inputs']['steps'] = input_promts.steps;
    workflow['9']['inputs']['cfg'] = input_promts.cfg;
    workflow['9']['inputs']['sampler_name'] = input_promts.sampleMethos;

    const prompt = stringify(workflow);
    return prompt;
  }

  convertToComfyUIPromptImg2Img(input_promts: InputPromts) {
    this.imgToImagePromptValidate(input_promts);
    const workflow_data = fs.readFileSync(this.jsonFilePath + 'img2img.json', {
      encoding: 'utf-8',
    });
    const workflow = JSON.parse(workflow_data);

    workflow['1']['inputs']['ckpt_name'] = input_promts.style;
    workflow['2']['inputs']['text'] = input_promts.positivePrompt;
    workflow['3']['inputs']['text'] = input_promts.negativePrompt;
    workflow['8']['inputs']['width'] = input_promts.width;
    workflow['8']['inputs']['height'] = input_promts.height;
    workflow['8']['inputs']['batch_size'] = input_promts.numberOfImage;
    if (input_promts.seed != null) {
      workflow['4']['inputs']['seed'] = input_promts.seed;
    } else {
      const seed = Math.floor(Math.random() * 1000000000) + 1;
      workflow['4']['inputs']['seed'] = seed;
    }
    workflow['4']['inputs']['steps'] = input_promts.steps;
    workflow['4']['inputs']['cfg'] = input_promts.cfg;
    workflow['4']['inputs']['sampler_name'] = input_promts.sampleMethos;

    const prompt = stringify(workflow);
    return prompt;
  }

  getAIInfo() {
    return JSON.stringify({
      ai_name: 'comfyUI',
      inputs: Object.values(this.info.inputs),
    });
  }

  textToImagePromptValidate(input_promts: InputPromts) {
    if (input_promts.style == null) {
      input_promts.style = this.info.inputs.style.default;
    } else {
      this.validateInput(this.info.inputs.style, input_promts.style);
    }

    if (input_promts.positivePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(this.info.inputs.positivePrompt.name),
      );
    } else {
      this.validateInput(this.info.inputs.positivePrompt, input_promts.positivePrompt);
    }

    if (input_promts.negativePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(this.info.inputs.negativePrompt.name),
      );
    } else {
      this.validateInput(this.info.inputs.negativePrompt, input_promts.negativePrompt);
    }

    if (input_promts.width == null) {
      input_promts.width = this.info.inputs.width.default;
    } else {
      this.validateInput(this.info.inputs.width, input_promts.width);
    }

    if (input_promts.height == null) {
      input_promts.height = this.info.inputs.height.default;
    } else {
      this.validateInput(this.info.inputs.height, input_promts.height);
    }

    if (input_promts.numberOfImage == null) {
      input_promts.numberOfImage = this.info.inputs.size.default;
    } else {
      this.validateInput(this.info.inputs.size, input_promts.numberOfImage);
    }

    if (input_promts.steps == null) {
      input_promts.steps = this.info.inputs.steps.default;
    } else {
      this.validateInput(this.info.inputs.steps, input_promts.steps);
    }

    if (input_promts.sampleMethos == null) {
      input_promts.sampleMethos = this.info.inputs.sampler.default;
    } else {
      this.validateInput(this.info.inputs.sampler, input_promts.sampleMethos);
    }

    if (input_promts.cfg == null) {
      input_promts.cfg = this.info.inputs.cfg.default;
    } else {
      this.validateInput(this.info.inputs.cfg, input_promts.cfg);
    }

    if (input_promts.style == null) {
      input_promts.style = this.info.inputs.style.default;
    } else {
      this.validateInput(this.info.inputs.style, input_promts.style);
    }
  }

  imgToImagePromptValidate(input_promts: InputPromts) {
    this.textToImagePromptValidate(input_promts);
    if (input_promts.noise == null) {
      input_promts.noise = this.info.inputs.noise.default;
    } else {
      this.validateInput(this.info.inputs.noise, input_promts.noise);
    }

    if (input_promts.image == null) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(this.info.inputs.image.name));
    } else {
      this.validateInput(this.info.inputs.image, input_promts.image);
    }
  }

  validateInput(generateInput: GenerateInput, value: any) {
    if (!generateInput.validate(value)) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(generateInput.name));
    }
  }
}
