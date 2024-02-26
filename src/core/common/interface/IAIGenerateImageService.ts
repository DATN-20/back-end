import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';

export interface IAIGenerateImageService {
  generateTextToImage(input_promts: InputPromts);
  generateImageToImage(input_promts: InputPromts);
  getHistory(promptId: string);
  uploadImage(input_path, name, image_type: string, overwrite: boolean);
}
