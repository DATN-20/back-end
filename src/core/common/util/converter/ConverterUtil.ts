import { GenerateInputs } from '@core/module/generate-image/entity/request/GenerateInputs';
import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';

export class ConverterUtil {
  public static convertGenerateInputsToInputPromts(
    generate_inputs: GenerateInputs,
    user_id: number,
  ) {
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
    };
    return result;
  }
}
