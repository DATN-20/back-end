import { NodeControlnetEnum } from '../../type/Controlnet/NodeControlnetEnum';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import * as fs from 'fs';
import { ComfyUIUtil } from '../ComfyUIUtil';
import { ControlnetNameEnum } from '../../type/Controlnet/ControlnetNameEnum';
import { AIOPreprocessorType } from '../../type/Controlnet/AIOPreprocessorType';
import { WorkflowResultJson } from '../../type/WorkflowResult';

export class ComfyUIControlNet {
  public static generateControlNetComponent(
    start_id: string,
    control_net_name: ControlnetNameEnum,
    image_name: string,
    link_condition_to_node_id: string,
  ): WorkflowResultJson {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'controlnet-component.json',
      {
        encoding: 'utf-8',
      },
    );
    let node_id = parseInt(start_id);

    // replace node id
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOADER,
      node_id.toString(),
    );
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOAD_IMAGE,
      node_id.toString(),
    );
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_APPLY,
      node_id.toString(),
    );

    // replace the necessary information
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
      output_id: node_id.toString(),
    };
  }

  public static linkToKsampler(workflow: any, control_net_apply_id: string) {
    const ksampler_id = ComfyUIUtil.findIdByTitle(workflow, 'KSampler');

    workflow[ksampler_id]['inputs']['positive'][0] = control_net_apply_id;
    return workflow;
  }

  public static generateControlNetComponentWithAIO(
    start_id: string,
    control_net_name: ControlnetNameEnum,
    aio_preprocessor_type: AIOPreprocessorType,
    image_name: string,
    link_condition_to_node_id: string,
  ): WorkflowResultJson {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'controlnet-component-with-aio.json',
      {
        encoding: 'utf-8',
      },
    );
    let node_id = parseInt(start_id);
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOADER,
      node_id.toString(),
    );
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_LOAD_IMAGE,
      node_id.toString(),
    );
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_AIO_PREPROCESSOR_ID,
      node_id.toString(),
    );
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeControlnetEnum.CONTROLNET_APPLY,
      node_id.toString(),
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
      NodeControlnetEnum.CONTROLNET_AIO_TYPE_PREPROCESSOR,
      aio_preprocessor_type,
    );
    workflow_data_string = workflow_data_string.replace(
      NodeControlnetEnum.POSITIVE_PROMPT,
      link_condition_to_node_id,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: node_id.toString(),
    };
  }
}
