import { get } from 'env-var';

export class ComfyUIConfig {
  public static readonly COMFYUI_URL: string = get('COMFYUI_URL')
    .default('103.20.97.111')
    .asString();

  public static readonly COMFYUI_NAME: string = 'COMFYUI';
}
