export interface IAIFeatureService {
  removeBackground(image_buffer: Buffer): Promise<Buffer[]>;
}
