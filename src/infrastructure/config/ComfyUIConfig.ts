import { get } from 'env-var';

export class ComfyUIConfig {
  public static readonly CLOUDINARY_NAME: string = get('COMFYUI_URL')
    .default('127.0.0.1:8188')
    .asString();
}
