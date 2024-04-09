import { Injectable } from '@nestjs/common';
import { RemoveBackgroundComponentParams } from '../upscale/types/ComponentParameters';
import { COMFYUI_JSON_FILE_PATH } from '../ComfyUIConstant';
import * as fs from 'fs';
import { NodeRemoveBackground } from '../upscale/types/NodeRemoveBackground';

@Injectable()
export class ComfyUIRemoveBackground {
  public generateWorkflow(args: RemoveBackgroundComponentParams) {
    let workflow_data_string = fs.readFileSync(
      COMFYUI_JSON_FILE_PATH + 'controlnet-component.json',
      {
        encoding: 'utf-8',
      },
    );
    let node_id = parseInt(args.start_id);
    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeRemoveBackground.IMAGE_REMBG_INPUT_IMAGE_NODE_ID,
      node_id.toString(),
    );
    workflow_data_string = workflow_data_string.replaceAll(
      NodeRemoveBackground.IMAGE_REMBG_INPUT_IMAGE_FILE_NAME,
      args.input_image_file_name,
    );

    node_id += 1;
    const image_rembg_id = node_id.toString();
    workflow_data_string = workflow_data_string.replaceAll(
      NodeRemoveBackground.IMAGE_REMBG_ID,
      image_rembg_id.toString(),
    );

    node_id += 1;
    workflow_data_string = workflow_data_string.replaceAll(
      NodeRemoveBackground.IMAGE_REMBG_SAVE_IMAGE_ID,
      node_id.toString(),
    );

    const workflow = JSON.parse(workflow_data_string);
    workflow[image_rembg_id]['inputs']['transparency'] = args.rembg_property.transparency;
    workflow[image_rembg_id]['inputs']['model'] = args.rembg_property.model;
    workflow[image_rembg_id]['inputs']['post_processing'] = args.rembg_property.post_processing;
    workflow[image_rembg_id]['inputs']['only_mask'] = args.rembg_property.only_mask;
    workflow[image_rembg_id]['inputs']['alpha_matting'] = args.rembg_property.alpha_matting;
    workflow[image_rembg_id]['inputs']['alpha_matting_foreground_threshold'] =
      args.rembg_property.alpha_matting_foreground_threshold;
    workflow[image_rembg_id]['inputs']['alpha_matting_background_threshold'] =
      args.rembg_property.alpha_matting_background_threshold;
    workflow[image_rembg_id]['inputs']['alpha_matting_erode_size'] =
      args.rembg_property.alpha_matting_erode_size;
    workflow[image_rembg_id]['inputs']['background_color'] = args.rembg_property.background_color;

    return {
      workflow,
      output_id: node_id.toString(),
    };
  }
}
