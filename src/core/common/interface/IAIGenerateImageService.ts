import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';

export interface IAIGenerateImageService {
  generateTextToImage(input_promts: InputPromts): Promise<Buffer[]>;
  generateImageToImage(input_promts: InputPromts): Promise<Buffer[]>;
  getAIInfo();
}
