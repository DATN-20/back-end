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

export const DEFAULT_REMOVE_BACKGROUND_PROPERTY: RemoveBackgroundProperty = {
  transparency: true,
  model: RemoveBackgroundModel.ISNET_ANIME,
  post_processing: true,
  only_mask: false,
  alpha_matting: true,
  alpha_matting_foreground_threshold: 0,
  alpha_matting_background_threshold: 0,
  alpha_matting_erode_size: 100,
  background_color: 'none',
};
