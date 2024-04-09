import { Injectable } from '@nestjs/common';
import { COMFYUI_JSON_FILE_PATH } from './ComfyUIConstant';
import * as fs from 'fs';
import { InputPromts } from '../type/InputPrompts';
import { ComfyUIFeature } from './ComfyUIFeature';

@Injectable()
export class ComfyUIConverter {
  constructor(private readonly comfyUIFeature: ComfyUIFeature) {}

  async convertToComfyUIPromptText2Img(input_promts: InputPromts): Promise<any> {
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
      workflow = await this.comfyUIFeature.applyMultipleControlNet(
        workflow,
        input_promts.controlNets,
      );
    }

    if (input_promts.isUpscale) {
      workflow = this.comfyUIFeature.applyUpscale(workflow).workflow;
    }

    return workflow;
  }

  async convertToComfyUIPromptImg2Img(input_promts: InputPromts): Promise<any> {
    const workflow_data = fs.readFileSync(COMFYUI_JSON_FILE_PATH + 'img2img.json', {
      encoding: 'utf-8',
    });
    let workflow = JSON.parse(workflow_data);

    workflow['1']['inputs']['ckpt_name'] = input_promts.style;
    workflow['2']['inputs']['text'] = input_promts.positivePrompt;
    workflow['3']['inputs']['text'] = input_promts.negativePrompt;
    workflow['10']['inputs']['width'] = input_promts.width;
    workflow['10']['inputs']['height'] = input_promts.height;
    workflow['12']['inputs']['batch_size'] = input_promts.numberOfImage;
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
    workflow['4']['inputs']['denoise'] = input_promts.noise;

    if (input_promts.controlNets.length !== 0) {
      workflow = await this.comfyUIFeature.applyMultipleControlNet(
        workflow,
        input_promts.controlNets,
      );
    }

    if (input_promts.isUpscale) {
      workflow = this.comfyUIFeature.applyUpscale(workflow).workflow;
    }

    return workflow;
  }
}
