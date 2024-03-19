import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { ComfyUIInfo } from './ComfyUIInfo';
import { Exception } from '@core/common/exception/Exception';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';
import { GenerateInput } from '../type/GenerateInput/GenerateInput';
import { ComfyUISokcet } from './ComfyUISocket';
import { EnvironmentConverter } from '@core/common/util/converter/EnvironmentConverter';
import { COMFYUI_JSON_FILE_PATH } from './ComfyUIConstant';
import { ComfyUIControlNet } from './control-net/ComfyUIControlNet';
import { ComfyUIUtil } from './ComfyUIUtil';
import { InputControlnet } from '../type/Controlnet/InputControlnet';
import { FileUtil } from '@core/common/util/FileUtil';
import { ComfyUIUpscale } from './upscale/ComfyUIUpscale';
import { UpscaleModelName } from '../type/Upscale/UpscaleModelName';

@Injectable()
export class ComfyUIService implements IAIGenerateImageService {
  constructor(private httpService: HttpService) {}

  private info = new ComfyUIInfo();

  async generateTextToImage(input_promts: InputPromts): Promise<Buffer[]> {
    const comfyui_prompt = this.convertToComfyUIPromptText2Img(input_promts);
    const comfyui_socket = new ComfyUISokcet();
    const list_image_buffer = await this.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  async generateImageToImage(input_promts: InputPromts): Promise<Buffer[]> {
    const comfyui_prompt = await this.convertToComfyUIPromptImg2Img(input_promts);
    const comfyui_socket = new ComfyUISokcet();
    await this.uploadImage(input_promts.image.buffer, input_promts.filename);
    const list_image_buffer = await this.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

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
    const form_request = new FormData();
    form_request.append('image', buffer, {
      filename: file_name,
    });
    form_request.append('type', image_type);
    form_request.append('overwrite', String(overwrite).toLowerCase());

    try {
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
      web_socket.getExecutedResultFromMessage(prompt_id, async output_images => {
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
      });
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

  async convertToComfyUIPromptText2Img(input_promts: InputPromts): Promise<any> {
    this.textToImagePromptValidate(input_promts);
    const workflow_data = fs.readFileSync(COMFYUI_JSON_FILE_PATH + 'text2img.json', {
      encoding: 'utf-8',
    });
    let workflow = JSON.parse(workflow_data);
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

    if (input_promts.controlNets.length !== 0) {
      workflow = await this.applyMultipleControlNet(workflow, input_promts.controlNets);
    }

    if (input_promts.isUpscale) {
      workflow = this.applyUpscale(workflow).workflow;
    }

    return workflow;
  }

  async convertToComfyUIPromptImg2Img(input_promts: InputPromts): Promise<any> {
    this.imageToImagePromptValidate(input_promts);
    const workflow_data = fs.readFileSync(COMFYUI_JSON_FILE_PATH + 'img2img.json', {
      encoding: 'utf-8',
    });
    let workflow = JSON.parse(workflow_data);

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
    workflow['6']['inputs']['image'] = input_promts.filename;
    workflow['10']['inputs']['width'] = input_promts.width;
    workflow['10']['inputs']['height'] = input_promts.height;

    if (input_promts.controlNets.length !== 0) {
      workflow = await this.applyMultipleControlNet(workflow, input_promts.controlNets);
    }

    if (input_promts.isUpscale) {
      workflow = this.applyUpscale(workflow).workflow;
    }

    return workflow;
  }

  getAIInfo() {
    return {
      ai_name: 'comfyUI',
      inputs: Object.values(this.info.inputs).map(input => JSON.parse(input.toJson())),
    };
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

  imageToImagePromptValidate(input_promts: InputPromts) {
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

  validateInput(generateInput: GenerateInput, value: any): void {
    if (!generateInput.validate(value)) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(generateInput.name));
    }
  }

  async applyControlNet(workflow: any, input_controlnet: InputControlnet, start_id: string) {
    const uploaded_image_result = await this.uploadImage(
      FileUtil.getBufferFromBase64(input_controlnet.image),
      `${Date.now()}.png`,
    );

    const max_key_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);
    const control_net_component_result = ComfyUIControlNet.generateControlNetComponent(
      max_key_id,
      input_controlnet.controlNetName,
      uploaded_image_result.name,
      start_id,
    );
    let updated_workflow = ComfyUIUtil.appendWorkflow(
      workflow,
      control_net_component_result.workflow,
    );

    return {
      workflow: updated_workflow,
      output_id: control_net_component_result.output_id,
    };
  }

  async applyMultipleControlNet(workflow: any, input_controlnets: InputControlnet[]) {
    const positive_node_id = ComfyUIUtil.findIdByTitle(workflow, 'Positive Prompt');
    let start_id = positive_node_id;
    for (let index = 0; index < input_controlnets.length; index++) {
      const input_controlnet = input_controlnets[index];

      const applied_control_net_result = await this.applyControlNet(
        workflow,
        input_controlnet,
        start_id,
      );
      start_id = applied_control_net_result.output_id;
      workflow = applied_control_net_result.workflow;

      if (index === input_controlnets.length - 1) {
        workflow = ComfyUIControlNet.linkToKsampler(workflow, applied_control_net_result.output_id);
      }
    }

    return workflow;
  }

  applyUpscale(workflow: any) {
    const vae_decode_node_id = ComfyUIUtil.findIdByTitle(workflow, 'VAE Decode');
    const max_key_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);

    const upscale_component = ComfyUIUpscale.generateUpscaleComponent(
      max_key_id,
      UpscaleModelName.REAL_ESRGAN_X4PLUS,
      vae_decode_node_id,
    );

    let updated_workflow = ComfyUIUtil.appendWorkflow(workflow, upscale_component.workflow);
    updated_workflow = ComfyUIUpscale.linkToSaveImage(
      updated_workflow,
      upscale_component.output_id,
    );

    return {
      workflow: updated_workflow,
      output_id: upscale_component.output_id,
    };
  }
}
