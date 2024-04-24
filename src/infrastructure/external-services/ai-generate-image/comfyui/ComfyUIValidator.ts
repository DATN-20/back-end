import { Injectable } from '@nestjs/common';
import { ComfyUIInfo } from './info/ComfyUIInfo';
import { InputPromts } from '../type/InputPrompts';
import { Exception } from '@core/common/exception/Exception';
import { AIGenerateImageError } from '@core/common/resource/error/AIGenerateImageError';
import { GenerateInput } from '../type/GenerateInput/GenerateInput';
import { GenerateByImagesStyleInputPromts } from '../type/GenerateByImagesStyleInputPromts';
import { ComfyUIGenerateImageBasicInputsInfo } from './info/ComfyUIGenerateImageBasicInputsInfo';
import { ComfyUIGenerateImageByImagesStyleInputsInfo } from './info/ComfyUIGenerateImageByImagesStyleInputsInfo';
import { ImageToUnclipInput } from '../type/Unclip/ImageToUnClipInput';
import { SliderInput } from '../type/GenerateInput/SliderInput';

@Injectable()
export class ComfyUIValidator {
  textToImagePromptValidate(info: ComfyUIGenerateImageBasicInputsInfo, input_promts: InputPromts) {
    if (input_promts.style == null) {
      input_promts.style = info.inputs.style.default;
    } else {
      this.validateInput(info.inputs.style, input_promts.style);
    }

    if (input_promts.positivePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.positivePrompt.name),
      );
    } else {
      this.validateInput(info.inputs.positivePrompt, input_promts.positivePrompt);
    }

    if (input_promts.negativePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.negativePrompt.name),
      );
    } else {
      this.validateInput(info.inputs.negativePrompt, input_promts.negativePrompt);
    }

    if (input_promts.width == null) {
      input_promts.width = info.inputs.width.default;
    } else {
      this.validateInput(info.inputs.width, input_promts.width);
    }

    if (input_promts.height == null) {
      input_promts.height = info.inputs.height.default;
    } else {
      this.validateInput(info.inputs.height, input_promts.height);
    }

    if (input_promts.numberOfImage == null) {
      input_promts.numberOfImage = info.inputs.size.default;
    } else {
      this.validateInput(info.inputs.size, input_promts.numberOfImage);
    }

    if (input_promts.steps == null) {
      input_promts.steps = info.inputs.steps.default;
    } else {
      this.validateInput(info.inputs.steps, input_promts.steps);
    }

    if (input_promts.sampleMethos == null) {
      input_promts.sampleMethos = info.inputs.sampler.default;
    } else {
      this.validateInput(info.inputs.sampler, input_promts.sampleMethos);
    }

    if (input_promts.cfg == null) {
      input_promts.cfg = info.inputs.cfg.default;
    } else {
      this.validateInput(info.inputs.cfg, input_promts.cfg);
    }

    if (input_promts.style == null) {
      input_promts.style = info.inputs.style.default;
    } else {
      this.validateInput(info.inputs.style, input_promts.style);
    }
  }

  imageToImagePromptValidate(info: ComfyUIGenerateImageBasicInputsInfo, input_promts: InputPromts) {
    this.textToImagePromptValidate(info, input_promts);
    if (input_promts.noise == null) {
      input_promts.noise = info.inputs.noise.default;
    } else {
      this.validateInput(info.inputs.noise, input_promts.noise);
    }

    if (input_promts.image == null) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.image.name));
    } else {
      this.validateInput(info.inputs.image, input_promts.image);
    }

    if (input_promts.noise == null) {
      input_promts.noise = info.inputs.noise.default;
    } else {
      this.validateInput(info.inputs.noise, input_promts.noise);
    }
  }

  imageByImagesStylePromptValidate(
    info: ComfyUIGenerateImageByImagesStyleInputsInfo,
    input_prompts: GenerateByImagesStyleInputPromts,
  ) {
    if (input_prompts.positivePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.positivePrompt.name),
      );
    } else {
      this.validateInput(info.inputs.positivePrompt, input_prompts.positivePrompt);
    }

    if (input_prompts.negativePrompt == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.negativePrompt.name),
      );
    } else {
      this.validateInput(info.inputs.negativePrompt, input_prompts.negativePrompt);
    }

    if (input_prompts.width == null) {
      input_prompts.width = info.inputs.width.default;
    } else {
      this.validateInput(info.inputs.width, input_prompts.width);
    }

    if (input_prompts.height == null) {
      input_prompts.height = info.inputs.height.default;
    } else {
      this.validateInput(info.inputs.height, input_prompts.height);
    }

    if (input_prompts.numberOfImage == null) {
      input_prompts.numberOfImage = info.inputs.size.default;
    } else {
      this.validateInput(info.inputs.size, input_prompts.numberOfImage);
    }

    if (input_prompts.steps == null) {
      input_prompts.steps = info.inputs.steps.default;
    } else {
      this.validateInput(info.inputs.steps, input_prompts.steps);
    }

    if (input_prompts.sampleMethos == null) {
      input_prompts.sampleMethos = info.inputs.sampler.default;
    } else {
      this.validateInput(info.inputs.sampler, input_prompts.sampleMethos);
    }

    if (input_prompts.cfg == null) {
      input_prompts.cfg = info.inputs.cfg.default;
    } else {
      this.validateInput(info.inputs.cfg, input_prompts.cfg);
    }

    let noise_input = info.imageToUnclipNoiseAgementationInput;
    let stregth_input = info.imageToUnclipStrengthInput;
    if (input_prompts.imageToUnclips == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.imageToUnclips.name),
      );
    }
    for (let i = 0; i < input_prompts.imageToUnclips?.length; i++) {
      this.validateImageToUnclipInput(input_prompts.imageToUnclips[i], stregth_input, noise_input);
    }
  }

  validateImageToUnclipInput(
    input: ImageToUnclipInput,
    strength_input: GenerateInput,
    noise_input: GenerateInput,
  ) {
    if (input.image == null) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE('image'));
    }

    if (input.noiseAugmentation == null) {
      input.noiseAugmentation = noise_input.default;
    } else {
      this.validateInput(noise_input, input.noiseAugmentation);
    }

    if (input.strength == null) {
      input.strength = strength_input.default;
    } else {
      this.validateInput(strength_input, input.strength);
    }
  }

  validateInput(generateInput: GenerateInput, value: any): void {
    if (!generateInput.validate(value)) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(generateInput.name));
    }
  }
}
