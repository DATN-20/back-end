import { NodeControlnetEnum } from '../../type/Controlnet/NodeControlnetEnum';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import * as fs from 'fs';
import { ComfyUIUtil } from '../ComfyUIUtil';
import { ControlnetNameEnum } from '../../type/Controlnet/ControlnetNameEnum';

export class ComfyUIControlNet {
  public static generateControlNetComponent(
    start_id: string,
    control_net_name: ControlnetNameEnum,
    image_name: string,
    link_condition_to_node_id: string,
  ) {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'controlnet-component.json',
      {
        encoding: 'utf-8',
      },
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOADER,
      (parseInt(start_id) + 1).toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOAD_IMAGE,
      (parseInt(start_id) + 2).toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_APPLY,
      (parseInt(start_id) + 3).toString(),
    );
    workflow_data_string = workflow_data_string.replace(
      NodeControlnetEnum.CONTROLNET_LOADER_CONTROLNET_NAME,
      control_net_name,
    );
    workflow_data_string = workflow_data_string.replace(
      NodeControlnetEnum.CONTROLNET_LOAD_IMAGE_IMAGE,
      image_name,
    );
    workflow_data_string = workflow_data_string.replace(
      NodeControlnetEnum.POSITIVE_PROMPT,
      link_condition_to_node_id,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: (parseInt(start_id) + 3).toString(),
    };
  }

  public static linkToKsampler(workflow: any, control_net_apply_id: string) {
    const ksampler_id = ComfyUIUtil.findIdByTitle(workflow, 'KSampler');

    workflow[ksampler_id]['inputs']['positive'][0] = control_net_apply_id;
    return workflow;
  }
}
