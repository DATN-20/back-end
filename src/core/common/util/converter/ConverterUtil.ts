import { GenerateByImagesStyleInputs } from '@core/module/generate-image/entity/request/GenerateImageByImagesStyleInputs';
import { GenerateInputs } from '@core/module/generate-image/entity/request/GenerateInputs';
import { GenerateByImagesStyleInputPromts } from '@infrastructure/external-services/ai-generate-image/type/GenerateByImagesStyleInputPromts';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { IpadapterStyleTranferInput } from '@infrastructure/external-services/ai-generate-image/type/Ipadapter/IpadapterStyleTranferInput';
import { ImageToUnclipInput } from '@infrastructure/external-services/ai-generate-image/type/Unclip/ImageToUnClipInput';

export class ConverterUtil {
  public static convertGenerateInputsToInputPromts(
    generate_inputs: GenerateInputs,
    user_id: number,
  ): InputPromts {
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
      controlNets: generate_inputs.controlNets ?? [],
      isUpscale: generate_inputs.isUpscale ?? false,
      generationId: generate_inputs.generationId,
    };
    return result;
  }

  public static convertGenerateByImagesStyleInputsToGenerateByImagesStyleInputPromts(
    generate_inputs: GenerateByImagesStyleInputs,
    user_id: number,
  ): GenerateByImagesStyleInputPromts {
    const imageToUnlips = generate_inputs.imageToUnclipsImages?.map((image, index) => {
      const strength =
        generate_inputs.imageToUnclipsStrengths?.[index] !== undefined
          ? generate_inputs.imageToUnclipsStrengths[index]
          : null;
      const noiseAugmentation =
        generate_inputs.imageToUnclipsNoiseAugmentations?.[index] !== undefined
          ? generate_inputs.imageToUnclipsNoiseAugmentations[index]
          : null;
      const result: ImageToUnclipInput = {
        image: image,
        strength: strength,
        noiseAugmentation: noiseAugmentation,
      };
      return result;
    });

    const ipadapterStyleTranferInputs = generate_inputs.imageForIpadapters?.map((image, index) => {
      const weight =
        generate_inputs.imageForIpadapterWeight?.[index] !== undefined
          ? generate_inputs.imageForIpadapterWeight[index]
          : null;
      const cropPosition =
        generate_inputs.imageForIPAdapterCropPosition?.[index] !== undefined
          ? generate_inputs.imageForIPAdapterCropPosition[index]
          : null;
      const result: IpadapterStyleTranferInput = {
        image: image,
        weight: weight,
        cropPosition: cropPosition,
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
      controlNets: generate_inputs.controlNets ?? [],
      imageToUnclips: imageToUnlips,
      isUpscale: generate_inputs.isUpscale ?? false,
      ipadapterStyleTranferInputs: ipadapterStyleTranferInputs,
      generationId: generate_inputs.generationId,
    };

    return result;
  }
}
