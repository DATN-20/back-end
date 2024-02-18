import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { InputPromts } from '@infrastructure/external-services/type/InputPrompts';

export class ComfyUIService implements IAIGenerateImageService {
  generateTextToImage(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
  generateImageToImage(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
  getHistory(prompt_id: string) {
    throw new Error('Method not implemented.');
  }
  getImage(filename: string, subfolder: string, foldertype: string) {
    throw new Error('Method not implemented.');
  }
  uploadImage() {
    throw new Error('Method not implemented.');
  }
  getImages(ws: WebSocket, prompt: string) {
    throw new Error('Method not implemented.');
  }
  queuePrompt(prompt: string) {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptText2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }

  convertToComfyUIPromptImg2Img(input_promts: InputPromts) {
    throw new Error('Method not implemented.');
  }
}
