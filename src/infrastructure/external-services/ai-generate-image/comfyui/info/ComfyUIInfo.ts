import { ComfyUIGenerateImageBasicInputsInfo } from './ComfyUIGenerateImageBasicInputsInfo';
import { ComfyUIGenerateImageByImagesStyleInputsInfo } from './ComfyUIGenerateImageByImagesStyleInputsInfo';

export class ComfyUIInfo {
  public ai_name = 'comfy_ui';
  public generateImageBasicInputsInfo = new ComfyUIGenerateImageBasicInputsInfo();
  public generateImageToUnclipComponentInputsInfo =
    new ComfyUIGenerateImageByImagesStyleInputsInfo();
}
