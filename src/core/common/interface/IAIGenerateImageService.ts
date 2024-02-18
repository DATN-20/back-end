import { InputPromts } from '@infrastructure/external-services/type/InputPrompts';

export interface IAIGenerateImageService {
  generateTextToImage(input_promts: InputPromts);
  generateImageToImage(input_promts: InputPromts);
}
