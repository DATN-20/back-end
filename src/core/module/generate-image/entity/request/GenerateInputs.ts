import { InputPromts } from '@infrastructure/external-services/ai-generate-image/type/InputPrompts';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateInputs {
  @IsNotEmpty()
  aiName: string;
  @IsOptional()
  style: string;
  @IsNotEmpty()
  positivePrompt: string;
  @IsOptional()
  negativePrompt: string;
  @IsOptional()
  width: number;
  @IsOptional()
  height: number;
  @IsOptional()
  numberOfImage: number;
  @IsOptional()
  seed: number;
  @IsOptional()
  steps: number;
  @IsOptional()
  sampleMethos: string;
  @IsOptional()
  cfg: number;
  @IsOptional()
  image: Buffer[];
  @IsOptional()
  noise: number;

  public convertToInputPrompts(user_id: number): InputPromts {
    const result: InputPromts = {
      style: this.style,
      positivePrompt: this.positivePrompt,
      negativePrompt: this.negativePrompt,
      width: this.width,
      height: this.height,
      numberOfImage: this.numberOfImage,
      seed: this.seed,
      steps: this.steps,
      sampleMethos: this.sampleMethos,
      cfg: this.cfg,
      image: this.image,
      noise: this.noise,
      filename: `${user_id}`,
    };
    return result;
  }
}
