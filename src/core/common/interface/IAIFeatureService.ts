import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';

export interface IAIFeatureService {
  removeBackground(image_buffer: Buffer): Promise<Buffer[]>;
  upscale(image_buffer: Buffer): Promise<Buffer[]>;
  generateTagByImage(image_buffer: Buffer): Promise<string>;
}
