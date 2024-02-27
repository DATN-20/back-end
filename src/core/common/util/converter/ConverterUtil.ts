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
      width: generate_inputs.width,
      height: generate_inputs.height,
      numberOfImage: generate_inputs.numberOfImage,
      seed: generate_inputs.seed,
      steps: generate_inputs.steps,
      sampleMethos: generate_inputs.sampleMethos,
      cfg: generate_inputs.cfg,
      image: generate_inputs.image,
      noise: generate_inputs.noise,
      filename: `${user_id}`,
    };
    return result;
  }
}
