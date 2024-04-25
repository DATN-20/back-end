import { RemoveBackgroundModel } from './RemoveBackgroundModel';

export interface RemoveBackgroundProperty {
  transparency: boolean;
  model: RemoveBackgroundModel;
  post_processing: boolean;
  only_mask: boolean;
  alpha_matting: boolean;
  alpha_matting_foreground_threshold: number;
  alpha_matting_background_threshold: number;
  alpha_matting_erode_size: number;
  background_color: string;
}
