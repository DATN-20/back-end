export interface IAIFeatureService {
  removeBackground(image_buffer: Buffer): Promise<Buffer[]>;
  upscale(image_buffer: Buffer): Promise<Buffer[]>;
}
