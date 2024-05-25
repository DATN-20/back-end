import { IAIGenerateImageService } from '@core/common/interface/IAIGenerateImageService';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { Injectable } from '@nestjs/common';
import { ComfyUIInfo } from './info/ComfyUIInfo';
import { ComfyUISokcet } from './ComfyUISocket';
import { ComfyUIConverter } from './ComfyUIConverter';
import { ComfyUIValidator } from './ComfyUIValidator';
import { ComfyUIApi } from './ComfyUIApi';
import { ComfyUIFeature } from './ComfyUIFeature';
import { IAIFeatureService } from '@core/common/interface/IAIFeatureService';
import { IAIGenerateImageByImagesStyleService } from '@core/common/interface/IAIGenerateImageByImagesStyleService';
import { GenerateByImagesStyleInputPromts } from '../type/GenerateByImagesStyleInputPromts';
import { GenerationService } from '@core/module/generation/GenerationService';

@Injectable()
export class ComfyUIService
  implements IAIGenerateImageService, IAIFeatureService, IAIGenerateImageByImagesStyleService
{
  private info: ComfyUIInfo;

  constructor(
    private readonly comfyUIConverter: ComfyUIConverter,
    private readonly comfyUIValidator: ComfyUIValidator,
    private readonly comfyUIApi: ComfyUIApi,
    private readonly comfyUIFeature: ComfyUIFeature,
    private readonly generationService: GenerationService,
  ) {
    this.info = new ComfyUIInfo();
  }

  async upscale(image_buffer: Buffer): Promise<Buffer[]> {
    const comfyui_workflow = await this.comfyUIFeature.upscaleWorkflow(image_buffer);
    const comfyui_socket = new ComfyUISokcet(this.generationService);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_workflow);

    return list_image_buffer;
  }

  async removeBackground(image_buffer: Buffer): Promise<Buffer[]> {
    const comfyui_workflow = await this.comfyUIFeature.removeBackgroundWorkflow(image_buffer);
    const comfyui_socket = new ComfyUISokcet(this.generationService);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_workflow);

    return list_image_buffer;
  }

  async generateTextToImage(input_promts: InputPromts): Promise<Buffer[]> {
    this.comfyUIValidator.textToImagePromptValidate(
      this.info.generateImageBasicInputsInfo,
      input_promts,
    );
    const comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptText2Img(input_promts);
    const comfyui_socket = new ComfyUISokcet(this.generationService, input_promts.generationId);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  async generateImageToImage(input_promts: InputPromts): Promise<Buffer[]> {
    this.comfyUIValidator.imageToImagePromptValidate(
      this.info.generateImageBasicInputsInfo,
      input_promts,
    );
    const comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptImg2Img(input_promts);
    const comfyui_socket = new ComfyUISokcet(this.generationService, input_promts.generationId);
    await this.comfyUIApi.uploadImage(input_promts.image.buffer, input_promts.filename);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  getAIInfo() {
    return {
      ai_name: this.info.ai_name,
      inputs: Object.values(this.info.generateImageBasicInputsInfo.inputs).map(input =>
        JSON.parse(input.toJson()),
      ),
    };
  }

  async generateImageByImagesStyle(
    input_prompts: GenerateByImagesStyleInputPromts,
  ): Promise<Buffer[]> {
    return this.generateImageByImagesStyleUseIPAdapter(input_prompts);
  }

  async generateImageByImagesStyleUseIPAdapter(
    input_prompts: GenerateByImagesStyleInputPromts,
  ): Promise<Buffer[]> {
    //validate
    this.comfyUIValidator.imageByImagesStyleByIpadapterValidate(
      this.info.generateImageByImagesStyleInputsInfo,
      input_prompts,
    );
    let comfyui_prompt = await this.comfyUIConverter.convertToComfyUIImg2ImgIpadapterStyleTransfer(
      input_prompts,
    );

    const comfyui_socket = new ComfyUISokcet(this.generationService, input_prompts.generationId);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  async generateImageByImagesStyleUseUnclipModel(
    input_prompts: GenerateByImagesStyleInputPromts,
  ): Promise<Buffer[]> {
    this.comfyUIValidator.imageByImagesStyleByUnclipPromptValidate(
      this.info.generateImageByImagesStyleInputsInfo,
      input_prompts,
    );
    const comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptImg2ImgUnclip(
      input_prompts,
    );

    const comfyui_socket = new ComfyUISokcet(this.generationService, input_prompts.generationId);
    const list_image_buffer = await this.comfyUIApi.getImages(comfyui_socket, comfyui_prompt);

    return list_image_buffer;
  }

  getAIGenerateImageByImagesStyleInfo() {
    return {
      ai_name: this.info.ai_name,
      inputs: Object.values(this.info.generateImageByImagesStyleInputsInfo.inputs).map(input =>
        JSON.parse(input.toJson()),
      ),
    };
  }

  async generateTagByImage(image_buffer: Buffer): Promise<string> {
    const imageInput = await this.comfyUIApi.uploadImage(image_buffer, `${Date.now()}.png`);
    const comfyui_prompt = await this.comfyUIConverter.convertToComfyUIPromptImageToTag(
      imageInput.name,
    );
    const comfyui_socket = new ComfyUISokcet(this.generationService);
    comfyui_socket.skipStatus();

    const tags = await this.comfyUIApi.getTags(comfyui_socket, comfyui_prompt);
    return tags;
  }
}
