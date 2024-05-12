import { Injectable } from '@nestjs/common';
import { COMFYUI_JSON_FILE_PATH } from './ComfyUIConstant';
import * as fs from 'fs';
import { InputPromts } from '../type/InputPrompts';
import { ComfyUIFeature } from './ComfyUIFeature';
import { GenerateByImagesStyleInputPromts } from '../type/GenerateByImagesStyleInputPromts';
import { ComfyUIUtil } from './ComfyUIUtil';
import { FileUtil } from '@core/common/util/FileUtil';

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

  async convertToComfyUIPromptImg2ImgUnclip(
    input_prompts: GenerateByImagesStyleInputPromts,
  ): Promise<any> {
    const workflow_data = fs.readFileSync(COMFYUI_JSON_FILE_PATH + 'workflow-unclip-model.json', {
      encoding: 'utf-8',
    });
    let workflow = JSON.parse(workflow_data);
    const unclip_checkpoint_loader_id = '1';
    const positive_prompt_node_id = '2';
    const negative_prompt_node_id = '3';
    const ksampler_node_id = '4';
    const save_image_node_id = '7';
    const lantent_image_node_id = '6';

    workflow[positive_prompt_node_id]['inputs']['text'] = input_prompts.positivePrompt;
    workflow[negative_prompt_node_id]['inputs']['text'] = input_prompts.negativePrompt;
    if (input_prompts.seed != null) {
      workflow[ksampler_node_id]['inputs']['seed'] = input_prompts.seed;
    } else {
      const seed = Math.floor(Math.random() * 1000000000) + 1;
      workflow[ksampler_node_id]['inputs']['seed'] = seed;
    }
    workflow[ksampler_node_id]['inputs']['steps'] = input_prompts.steps;
    workflow[ksampler_node_id]['inputs']['cfg'] = input_prompts.cfg;
    workflow[ksampler_node_id]['inputs']['sampler_name'] = input_prompts.sampleMethos;

    workflow[lantent_image_node_id]['inputs']['width'] = input_prompts.width;
    workflow[lantent_image_node_id]['inputs']['height'] = input_prompts.height;
    workflow[lantent_image_node_id]['inputs']['batch_size'] = input_prompts.numberOfImage;

    workflow[save_image_node_id]['inputs']['filename_prefix'] = input_prompts.filename;

    if (input_prompts.imageToUnclips.length > 0) {
      const start_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);

      const image_to_unclip_components = await this.comfyUIFeature.addMultipleUnclipComponent(
        start_id,
        unclip_checkpoint_loader_id,
        positive_prompt_node_id,
        input_prompts.imageToUnclips,
      );

      workflow = ComfyUIUtil.appendWorkflow(workflow, image_to_unclip_components.workflow);

      workflow[ksampler_node_id]['inputs']['positive'][0] = image_to_unclip_components.output_id;
    }

    return workflow;
  }

  async convertToComfyUIImg2ImgIpadapterStyleTransfer(
    input_prompts: GenerateByImagesStyleInputPromts,
  ): Promise<any> {
    const workflow_data = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'ipadapter_style_tranfer_workflow.json',
      {
        encoding: 'utf-8',
      },
    );
    let workflow = JSON.parse(workflow_data);
    const start_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);
    const load_checkpoint_model_node_id = '1';
    const positive_prompt_node_id = '2';
    const negative_prompt_node_id = '3';
    const ksampler_node_id = '4';
    const save_image_node_id = '6';
    const lantent_image_node_id = '7';
    const ipadapter_loader_node_id = '8';

    workflow[positive_prompt_node_id]['inputs']['text'] = input_prompts.positivePrompt;
    workflow[negative_prompt_node_id]['inputs']['text'] = input_prompts.negativePrompt;
    if (input_prompts.seed != null) {
      workflow[ksampler_node_id]['inputs']['seed'] = input_prompts.seed;
    } else {
      const seed = Math.floor(Math.random() * 1000000000) + 1;
      workflow[ksampler_node_id]['inputs']['seed'] = seed;
    }
    workflow[ksampler_node_id]['inputs']['steps'] = input_prompts.steps;
    workflow[ksampler_node_id]['inputs']['cfg'] = parseFloat(input_prompts.cfg.toString());
    workflow[ksampler_node_id]['inputs']['sampler_name'] = input_prompts.sampleMethos;

    workflow[lantent_image_node_id]['inputs']['width'] = input_prompts.width;
    workflow[lantent_image_node_id]['inputs']['height'] = input_prompts.height;
    workflow[lantent_image_node_id]['inputs']['batch_size'] = input_prompts.numberOfImage;

    workflow[save_image_node_id]['inputs']['filename_prefix'] = input_prompts.filename;

    if (input_prompts.ipadapterStyleTranferInputs.length > 0) {
      let ipadpter_style_transfer_component =
        await this.comfyUIFeature.addMultipleStyleTransferComponent(
          start_id,
          ipadapter_loader_node_id,
          ipadapter_loader_node_id,
          input_prompts.ipadapterStyleTranferInputs,
        );

      workflow = ComfyUIUtil.appendWorkflow(workflow, ipadpter_style_transfer_component.workflow);
      workflow[ksampler_node_id]['inputs']['model'] = [
        ipadpter_style_transfer_component.output_id.toString(),
        0,
      ];
    }

    return workflow;
  }
}
