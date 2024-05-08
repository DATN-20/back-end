import { RemoveBackgroundModel } from './RemoveBackgroundModel';
import { RemoveBackgroundProperty } from './RemoveBackgroundProperty';

export const BACKGROUND_COLORS: Array<string> = ['black'];
export const MIN_ALPHA_MATTING_FOREGROUND_THRESHOLD = 0;
export const MAX_ALPHA_MATTING_FOREGROUND_THRESHOLD = 255;
export const MIN_ALPHA_MATTING_BACKGROUND_THRESHOLD = 0;
export const MAX_ALPHA_MATTING_BACKGROUND_THRESHOLD = 255;
export const MIN_ALPHA_MATTING_ERODE_SIZE = 0;
export const MAX_ALPHA_MATTING_ERODE_SIZE = 255;

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
