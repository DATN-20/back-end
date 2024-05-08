import * as fs from 'fs';
import { UpscaleModelName } from './types/UpscaleModelName';
import { NodeUpscaleInfo } from './types/NodeUpscaleInfo';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import { ComfyUIUtil } from '../ComfyUIUtil';
import { Injectable } from '@nestjs/common';
import { UpscalePropterty } from './types/UpscaleProperty';

@Injectable()
export class ComfyUIUpscale {
  private FILE_NAME = 'upscale-component.json';

  public generateUpscaleComponent(
    start_id: string,
    model_name: UpscaleModelName,
    input_image_id: string,
  ) {
    let workflow_data_string = fs.readFileSync(COMFYUI_JSON_FILE_PATH + this.FILE_NAME, {
      encoding: 'utf-8',
    });

    let current_id = (parseInt(start_id) + 1).toString();
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_LOADER_ID,
      current_id,
    );

    current_id = (parseInt(current_id) + 1).toString();
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_IMAGE_WITH_MODEL_ID,
      current_id,
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.LOAD_IMAGE_ID,
      input_image_id,
    );

    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_LOADER_MODEL_NAME,
      model_name,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: current_id,
    };
  }

  public linkToSaveImage(workflow: any, upscale_image_with_model_id: string) {
    const save_image_id = ComfyUIUtil.findIdByTitle(workflow, 'Save Image Finally');

    workflow[save_image_id]['inputs']['images'][0] = upscale_image_with_model_id;
    return workflow;
  }

  public generateWorkflow(
    input_image_file_name: string,
    upscale_property: UpscalePropterty,
    start_id = '0',
  ) {
    let workflow_data_string = fs.readFileSync(COMFYUI_JSON_FILE_PATH + 'upscale-workflow.json', {
      encoding: 'utf-8',
    });

    let node_id = parseInt(start_id);
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_LOADER_ID,
      node_id.toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_MODEL_LOADER_MODEL_NAME,
      upscale_property.model,
    );

    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.UPSCALE_IMAGE_WITH_MODEL_ID,
      node_id.toString(),
    );

    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.LOAD_IMAGE_ID,
      node_id.toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.LOAD_IMAGE_FILENAME,
      input_image_file_name,
    );

    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.SAVE_IMAGE_ID,
      node_id.toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeUpscaleInfo.SAVE_IMAGE_FILENAME,
      `${Date.now()}`,
    );

    return {
      workflow: JSON.parse(workflow_data_string),
      output_id: node_id,
    };
  }
}
