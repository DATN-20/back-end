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
    input_promts: GenerateByImagesStyleInputPromts,
  ) {
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

    let noise_input = info.imageToUnclipNoiseAgementationInput;
    let stregth_input = info.imageToUnclipStrengthInput;
    if (input_promts.imageToUnclips == null) {
      throw new Exception(
        AIGenerateImageError.INVALID_INPUT_VALUE(info.inputs.imageToUnclips.name),
      );
    }
    for (let i = 0; i < input_promts.imageToUnclips?.length; i++) {
      this.validateImageToUnclipInput(input_promts.imageToUnclips[i], stregth_input, noise_input);
    }
  }

  validateImageToUnclipInput(
    input: ImageToUnclipInput,
    strengthInput: GenerateInput,
    noiseInput: GenerateInput,
  ) {
    if (input.image == null) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE('image'));
    }

    if (input.noiseAugmentation == null) {
      input.noiseAugmentation = noiseInput.default;
    } else {
      this.validateInput(noiseInput, input.noiseAugmentation);
    }

    if (input.strength == null) {
      input.strength = strengthInput.default;
    } else {
      this.validateInput(strengthInput, input.strength);
    }
  }

  validateInput(generateInput: GenerateInput, value: any): void {
    if (!generateInput.validate(value)) {
      throw new Exception(AIGenerateImageError.INVALID_INPUT_VALUE(generateInput.name));
    }
  }
}
