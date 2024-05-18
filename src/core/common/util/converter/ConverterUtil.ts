import { GenerateByImagesStyleInputs } from '@core/module/generate-image/entity/request/GenerateImageByImagesStyleInputs';
import { GenerateInputs } from '@core/module/generate-image/entity/request/GenerateInputs';
import { InputControlnet } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/InputControlnet';
import { GenerateByImagesStyleInputPromts } from '@infrastructure/external-services/ai-generate-image/type/GenerateByImagesStyleInputPromts';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { IpadapterStyleTranferInput } from '@infrastructure/external-services/ai-generate-image/type/Ipadapter/IpadapterStyleTranferInput';
import { ImageToUnclipInput } from '@infrastructure/external-services/ai-generate-image/type/Unclip/ImageToUnClipInput';

export class ConverterUtil {
  public static convertGenerateInputsToInputPromts(
    generate_inputs: GenerateInputs,
    user_id: number,
  ): InputPromts {
    const controlnet_inputs = generate_inputs.controlNetImages?.map((image, index) => {
      const strength = this.getValueFromArrayInput(generate_inputs.controlnetImageStrengths, index);
      const is_preprocessor_value = this.getValueFromArrayInput(
        generate_inputs.controlnetIsPreprocessors,
        index,
      );
      const is_preprocessor =
        is_preprocessor_value !== null ? is_preprocessor_value === 'true' : false;

      const controlnet_type = this.getValueFromArrayInput(generate_inputs.controlNetTypes, index);
      const result: InputControlnet = {
        controlNetType: controlnet_type,
        image: image.buffer,
        isPreprocessor: is_preprocessor,
        strength: strength,
      };
      return result;
    });

    const result: InputPromts = {
      style: generate_inputs.style,
      positivePrompt: generate_inputs.positivePrompt,
      negativePrompt: generate_inputs.negativePrompt,
      width: parseInt(generate_inputs.width.toString()),
      height: parseInt(generate_inputs.height.toString()),
      numberOfImage: generate_inputs.numberOfImage,
      seed: generate_inputs.seed,
      steps: generate_inputs.steps,
      sampleMethos: generate_inputs.sampleMethos,
      cfg: generate_inputs.cfg,
      image: generate_inputs.image,
      noise: generate_inputs.noise,
      filename: `${user_id}_${Date.now()}.png`,
      controlNets: controlnet_inputs ?? [],
      isUpscale: generate_inputs.isUpscale ?? false,
      generationId: generate_inputs.generationId,
    };
    return result;
  }

  public static convertGenerateByImagesStyleInputsToGenerateByImagesStyleInputPromts(
    generate_inputs: GenerateByImagesStyleInputs,
    user_id: number,
  ): GenerateByImagesStyleInputPromts {
    const image_to_unlips = generate_inputs.imageToUnclipsImages?.map((image, index) => {
      const strength =
        generate_inputs.imageToUnclipsStrengths?.[index] !== undefined
          ? generate_inputs.imageToUnclipsStrengths[index]
          : null;
      const noise_augmentation =
        generate_inputs.imageToUnclipsNoiseAugmentations?.[index] !== undefined
          ? generate_inputs.imageToUnclipsNoiseAugmentations[index]
          : null;
      const result: ImageToUnclipInput = {
        image: image,
        strength: strength,
        noiseAugmentation: noise_augmentation,
      };
      return result;
    });

    const ipadapter_style_tranfer_inputs = generate_inputs.imageForIpadapters?.map(
      (image, index) => {
        const weight = this.getValueFromArrayInput(generate_inputs.imageForIpadapterWeight, index);

        const crop_position = this.getValueFromArrayInput(
          generate_inputs.imageForIPAdapterCropPosition,
          index,
        );
        const result: IpadapterStyleTranferInput = {
          image: image,
          weight: weight,
          cropPosition: crop_position,
        };
        return result;
      },
    );

    const controlnet_inputs = generate_inputs.controlNetImages?.map((image, index) => {
      const strength = this.getValueFromArrayInput(generate_inputs.controlnetImageStrengths, index);
      const is_preprocessor_value = this.getValueFromArrayInput(
        generate_inputs.controlnetIsPreprocessors,
        index,
      );
      const is_preprocessor =
        is_preprocessor_value !== null ? is_preprocessor_value === 'true' : false;

      const controlnet_type = this.getValueFromArrayInput(generate_inputs.controlNetTypes, index);
      const result: InputControlnet = {
        controlNetType: controlnet_type,
        image: image.buffer,
        isPreprocessor: is_preprocessor,
        strength: strength,
      };
      return result;
    });

    const result: GenerateByImagesStyleInputPromts = {
      positivePrompt: generate_inputs.positivePrompt,
      negativePrompt: generate_inputs.negativePrompt,
      width: generate_inputs.width,
      height: generate_inputs.height,
      numberOfImage: generate_inputs.numberOfImage,
      seed: generate_inputs.seed,
      steps: generate_inputs.steps,
      sampleMethos: generate_inputs.sampleMethos,
      cfg: generate_inputs.cfg,
      noise: generate_inputs.noise,
      filename: `${user_id}_${Date.now()}.png`,
      controlNets: controlnet_inputs ?? [],
      imageToUnclips: image_to_unlips,
      isUpscale: generate_inputs.isUpscale ?? false,
      ipadapterStyleTranferInputs: ipadapter_style_tranfer_inputs,
      generationId: generate_inputs.generationId,
    };

    return result;
  }

  //Use to check because if only 1 element input is not array
  private static getValueFromArrayInput(inputArr, index: number) {
    if (Array.isArray(inputArr)) {
      if (inputArr[index] !== undefined) {
        return inputArr[index];
      }
    } else if (inputArr !== undefined && index == 0) {
      return inputArr;
    }
    return null;
  }
}
