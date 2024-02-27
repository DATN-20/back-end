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
}
