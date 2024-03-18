import * as fs from 'fs';
import { UpscaleModelName } from '../../type/Upscale/UpscaleModelName';
import { NodeUpscaleInfo } from '../../type/Upscale/NodeUpscaleInfo';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import { ComfyUIUtil } from '../ComfyUIUtil';

export class ComfyUIUpscale {
  private static FILE_NAME: string = 'upscale-component.json';
  public static generateUpscaleComponent(
    start_id: string,
    model_name: UpscaleModelName,
    input_image_id: string,
  ) {
    let workflow_data_string = fs.readFileSync(COMFYUI_JSON_FILE_PATH + this.FILE_NAME, {
      encoding: 'utf-8',
    });

    let current_id = (parseInt(start_id) + 1).toString();
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_LOADER,
      current_id,
    );

    current_id = (parseInt(current_id) + 1).toString();
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_IMAGE_WITH_MODEL,
      current_id,
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_INPUT_IMAGE,
      input_image_id,
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_NAME,
      model_name,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: current_id,
    };
  }

  public static linkToSaveImage(workflow: any, upscale_image_with_model_id: string) {
    const save_image_id = ComfyUIUtil.findIdByTitle(workflow, 'Save Image Finally');

    workflow[save_image_id]['inputs']['images'][0] = upscale_image_with_model_id;
    return workflow;
  }
}
