import { get } from 'env-var';

export class ComfyUIConfig {
  public static readonly COMFYUI_URL: string = get('COMFYUI_URL')
    .default('127.0.0.1:8188')
    .asString();

  public static readonly COMFYUI_NAME: string = 'COMFYUI';
}
