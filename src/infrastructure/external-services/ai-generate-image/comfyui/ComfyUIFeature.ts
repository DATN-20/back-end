import { Injectable } from '@nestjs/common';
import { ComfyUIApi } from './ComfyUIApi';
import { InputControlnet } from './control-net/types/InputControlnet';
import { FileUtil } from '@core/common/util/FileUtil';
import { ComfyUIUtil } from './ComfyUIUtil';
import { ComfyUIControlNet } from './control-net/ComfyUIControlNet';
import { ComfyUIRemoveBackground } from './remove-background/ComfyUIRemoveBackground';
import { ComfyUIUpscale } from './upscale/ComfyUIUpscale';
import { UpscaleModelName } from './upscale/types/UpscaleModelName';
import { DEFAULT_REMOVE_BACKGROUND_PROPERTY } from './remove-background/types/constant';
import { DEFAULT_UPSCALE_PROPERTY } from './upscale/types/constant';
import { ComfyUIUnclip } from './unclip/ComfyUIUnclip';
import { ImageToUnclipInput } from '../type/Unclip/ImageToUnClipInput';
import { ControlNetModelMapping } from './control-net/ControlNetModelMapping';
import { WorkflowResultJson } from '../type/WorkflowResult';

@Injectable()
export class ComfyUIFeature {
  constructor(
    private readonly comfyUIApi: ComfyUIApi,
    private readonly comfyUIControlNet: ComfyUIControlNet,
    private readonly comfyUIUpscale: ComfyUIUpscale,
    private readonly comfyUIRemoveBackground: ComfyUIRemoveBackground,
    private readonly comfyUIUnclip: ComfyUIUnclip,
    private readonly controlNetModelMapping: ControlNetModelMapping,
  ) {}

  async applyControlNet(
    workflow: any,
    input_controlnet: InputControlnet,
    start_id: string,
  ): Promise<WorkflowResultJson> {
    // const uploaded_image_result = await this.comfyUIApi.uploadImage(
    //   input_controlnet.image,
    //   `${Date.now()}.png`,
    // );

    const max_key_id = ComfyUIUtil.getMaximumIdOfWorkflow(workflow);

    const control_net_name = this.controlNetModelMapping.getControlNet(
      input_controlnet.controlNetType,
    );
    if (input_controlnet.isPreprocessor) {
      const aio_preprocessor = this.controlNetModelMapping.getAIOPreprocessor(
        input_controlnet.controlNetType,
      );

      const control_net_component_result =
        this.comfyUIControlNet.generateControlNetComponentWithAIO(
          max_key_id,
          control_net_name,
          input_controlnet.strength,
          aio_preprocessor,
          'abc',
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

    const control_net_component_result = this.comfyUIControlNet.generateControlNetComponent(
      max_key_id,
      control_net_name,
      input_controlnet.strength,
      'abc',
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

  async addMultipleUnclipComponent(
    start_id: string,
    load_unclip_checkpoint_node_id: string,
    precondition_node_id: string,
    imag_to_unclip_inputs: ImageToUnclipInput[],
  ): Promise<WorkflowResultJson> {
    let workflow = {};
    for (let i = 0; i < imag_to_unclip_inputs.length; i++) {
      let image_to_unclip = imag_to_unclip_inputs[i];
      const uploaded_image_result = await this.comfyUIApi.uploadImage(
        image_to_unclip.image.buffer,
        `${Date.now()}.png`,
      );
      let image_to_unclip_component = this.comfyUIUnclip.generateImageToUnclipComponent(
        start_id,
        load_unclip_checkpoint_node_id,
        uploaded_image_result.name,
        image_to_unclip.strength,
        image_to_unclip.noiseAugmentation,
        precondition_node_id,
      );
      workflow = { ...workflow, ...image_to_unclip_component.workflow };
      start_id = image_to_unclip_component.output_id;
      precondition_node_id = image_to_unclip_component.output_id;
    }

    return {
      workflow: workflow,
      output_id: start_id,
    };
  }

  applyUpscale(workflow: any): WorkflowResultJson {
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
      `${Date.now()}.jpg`,
    );

    return this.comfyUIRemoveBackground.generateWorkflow(
      result_uploaded_image.name,
      DEFAULT_REMOVE_BACKGROUND_PROPERTY,
    ).workflow;
  }

  async upscaleWorkflow(image_buffer: Buffer) {
    const result_uploaded_image = await this.comfyUIApi.uploadImage(
      image_buffer,
      `${Date.now()}.jpeg`,
    );

    return this.comfyUIUpscale.generateWorkflow(
      result_uploaded_image.name,
      DEFAULT_UPSCALE_PROPERTY,
    ).workflow;
  }
}
