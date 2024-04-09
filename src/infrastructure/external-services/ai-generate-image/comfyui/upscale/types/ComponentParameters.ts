import { RemoveBackgroundProperty } from './RemoveBackgroundProperty';

export interface RemoveBackgroundComponentParams {
  start_id: string;
  input_image_file_name: string;
  input_image_node_id: string;
  rembg_property: RemoveBackgroundProperty;
}
