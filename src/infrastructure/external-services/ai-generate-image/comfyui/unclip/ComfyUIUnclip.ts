import * as fs from 'fs';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import { NodeImageUnclipEnum } from '../../type/Unclip/NodeImageUnclipEnum';
import { WorkflowResultJson } from '../../type/WorkflowResult';

export class ComfyUIUnclip {
  public generateImageToUnclipComponent(
    start_id: string,
    load_unclip_checkpoint_node_id: string,
    image_name: string,
    strength: number,
    noise_augmentation: number,
    condition_pre_node_id: string,
  ): WorkflowResultJson {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'image-to-unclip-component.json',
      {
        encoding: 'utf-8',
      },
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeImageUnclipEnum.LOAD_IMAGE,
      (parseInt(start_id) + 1).toString(),
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeImageUnclipEnum.CLIP_VISION_ENCODE,
      (parseInt(start_id) + 2).toString(),
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeImageUnclipEnum.UNCLIP_CONDITION,
      (parseInt(start_id) + 3).toString(),
    );

    workflow_data_string = workflow_data_string.replace(
      NodeImageUnclipEnum.INPUT_IMAGE,
      image_name,
    );

    workflow_data_string = workflow_data_string.replace(
      NodeImageUnclipEnum.UNCLIP_NOISE_AUGMENTATION,
      noise_augmentation.toString(),
    );

    workflow_data_string = workflow_data_string.replace(
      NodeImageUnclipEnum.UNCLIP_STRENGTH,
      strength.toString(),
    );

    workflow_data_string = workflow_data_string.replace(
      NodeImageUnclipEnum.UNCLIP_PRE_CONDITION,
      condition_pre_node_id,
    );

    workflow_data_string = workflow_data_string.replace(
      NodeImageUnclipEnum.LOAD_UNCLIP_CHECKPOINT_NODE,
      load_unclip_checkpoint_node_id,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: (parseInt(start_id) + 3).toString(),
    };
  }
}
