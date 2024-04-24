import { GenerateByImagesStyleInputPromts } from '@infrastructure/external-services/ai-generate-image/type/GenerateByImagesStyleInputPromts';

export interface IAIGenerateImageByImagesStyleService {
  generateImageByImagesStyle(input_promts: GenerateByImagesStyleInputPromts): Promise<Buffer[]>;
  getAIGenerateImageByImagesStyleInfo();
}
