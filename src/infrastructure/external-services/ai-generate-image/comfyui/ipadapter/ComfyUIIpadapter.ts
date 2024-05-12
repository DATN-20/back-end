import * as fs from 'fs';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import { IpadapterEnum } from '../../type/Ipadapter/IpadapterEnum';
import { IpadapterStyleTransferWorkflow } from '../../type/IpadapterStyleTransferWorkflowResponse';
export class ComfyUIIpadapter {
  public generateIpadapterStyleTransferComponent(
    start_id: string,
    pre_model_node_id: string,
    ip_adapter_node_id: string,
    image_name: string,
    weight: number,
    crop_position: string,
  ): IpadapterStyleTransferWorkflow {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'ipadapter-style-transfer-component.json',
      {
        encoding: 'utf-8',
      },
    );

    let image_node = parseInt(start_id) + 1;
    let prep_image_node = parseInt(start_id) + 2;
    let ipadapter_advance_node = parseInt(start_id) + 3;

    workflow_data_string = workflow_data_string.replaceAll(
      IpadapterEnum.IPADAPTER_ADNVANCE_NODE,
      ipadapter_advance_node.toString(),
    );

    workflow_data_string = workflow_data_string.replaceAll(
      IpadapterEnum.LOAD_IMAGE,
      image_node.toString(),
    );

    workflow_data_string = workflow_data_string.replaceAll(
      IpadapterEnum.PREP_IMAGE_FOR_CLIPVISION_NODE,
      prep_image_node.toString(),
    );

    workflow_data_string = workflow_data_string.replace(IpadapterEnum.INPUT_IMAGE, image_name);

    workflow_data_string = workflow_data_string.replace(IpadapterEnum.CROP_POSITION, crop_position);

    workflow_data_string = workflow_data_string.replace(
      IpadapterEnum.IPADAPTER_ADNVANCE_WEIGHT,
      weight.toString(),
    );

    workflow_data_string = workflow_data_string.replace(
      IpadapterEnum.IPADAPTER_ADNVANCE_PRE_MODEL,
      pre_model_node_id,
    );

    workflow_data_string = workflow_data_string.replace(
      IpadapterEnum.IPADAPTER_ADNVANCE_IPADAPTER_MODEL,
      ip_adapter_node_id,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: ipadapter_advance_node.toString(),
      output_last_id: (parseInt(start_id) + 3).toString(),
    };
  }
}
