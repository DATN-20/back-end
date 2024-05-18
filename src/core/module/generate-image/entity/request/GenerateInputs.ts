import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputControlnet } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/InputControlnet';
import { ControlNetType } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/ControlNetType';

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
  image: Express.Multer.File;
  @IsOptional()
  noise: number;
  @IsOptional()
  controlNets: InputControlnet[];
  @IsOptional()
  isUpscale: boolean;
  @IsOptional()
  generationId: string;
  @IsOptional()
  controlNetImages: Express.Multer.File[];
  @IsOptional()
  controlnetImageStrengths: number[];
  @IsOptional()
  controlnetIsPreprocessors: string[];
  @IsOptional()
  controlNetTypes: ControlNetType[];
}
