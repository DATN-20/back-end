import { Injectable } from '@nestjs/common';
import { ComfyUIApi } from './ComfyUIApi';
import { InputControlnet } from '../type/Controlnet/InputControlnet';
import { FileUtil } from '@core/common/util/FileUtil';
import { ComfyUIUtil } from './ComfyUIUtil';
import { ComfyUIControlNet } from './control-net/ComfyUIControlNet';
import { ComfyUIRemoveBackground } from './remove-background/ComfyUIRemoveBackground';
import { ComfyUIUpscale } from './upscale/ComfyUIUpscale';
import { UpscaleModelName } from '../type/Upscale/UpscaleModelName';
import { DEFAULT_REMOVE_BACKGROUND_PROPERTY } from './remove-background/types/constant';

@Injectable()
export class ComfyUIFeature {
  constructor(
    private readonly comfyUIApi: ComfyUIApi,
    private readonly comfyUIControlNet: ComfyUIControlNet,
    private readonly comfyUIUpscale: ComfyUIUpscale,
    private readonly comfyUIRemoveBackground: ComfyUIRemoveBackground,
  ) {}

  async applyControlNet(workflow: any, input_controlnet: InputControlnet, start_id: string) {
    const uploaded_image_result = await this.comfyUIApi.uploadImage(
      FileUtil.getBufferFromBase64(input_controlnet.image),
      `${Date.now()}.png`,
    );

    const max_key_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);
    const control_net_component_result = this.comfyUIControlNet.generateControlNetComponent(
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
        workflow = this.comfyUIControlNet.linkToKsampler(
          workflow,
          applied_control_net_result.output_id,
        );
      }
    }

    return workflow;
  }

  applyUpscale(workflow: any) {
    const vae_decode_node_id = ComfyUIUtil.findIdByTitle(workflow, 'VAE Decode');
    const max_key_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);

    const upscale_component = this.comfyUIUpscale.generateUpscaleComponent(
      max_key_id,
      UpscaleModelName.REAL_ESRGAN_X4PLUS,
      vae_decode_node_id,
    );

    let updated_workflow = ComfyUIUtil.appendWorkflow(workflow, upscale_component.workflow);
    updated_workflow = this.comfyUIUpscale.linkToSaveImage(
      updated_workflow,
      upscale_component.output_id,
    );

    return {
      workflow: updated_workflow,
      output_id: upscale_component.output_id,
    };
  }

  async removeBackgroundWorkflow(image_buffer: Buffer) {
    const result_uploaded_image = await this.comfyUIApi.uploadImage(
      image_buffer,
      `${Date.now()}.png`,
    );

    return this.comfyUIRemoveBackground.generateWorkflow(
      result_uploaded_image.name,
      DEFAULT_REMOVE_BACKGROUND_PROPERTY,
    ).workflow;
  }
}
