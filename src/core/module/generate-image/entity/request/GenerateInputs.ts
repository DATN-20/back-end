import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputControlnet } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/InputControlnet';
import { ControlNetType } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/ControlNetType';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateInputs {
  @ApiProperty()
  @IsNotEmpty()
  aiName: string;
  @ApiProperty()
  @IsOptional()
  style: string;
  @ApiProperty()
  @IsNotEmpty()
  positivePrompt: string;
  @ApiProperty()
  @IsOptional()
  negativePrompt: string = '';
  @ApiProperty()
  @IsOptional()
  width: number;
  @ApiProperty()
  @IsOptional()
  height: number;
  @ApiProperty()
  @IsOptional()
  numberOfImage: number;
  @ApiProperty()
  @IsOptional()
  seed: number;
  @ApiProperty()
  @IsOptional()
  steps: number;
  @ApiProperty()
  @IsOptional()
  sampleMethos: string;
  @ApiProperty()
  @IsOptional()
  cfg: number;
  @ApiProperty()
  @IsOptional()
  image: Express.Multer.File;
  @ApiProperty()
  @IsOptional()
  noise: number;
  @ApiProperty()
  @IsOptional()
  isUpscale: boolean;
  @ApiProperty()
  @IsOptional()
  generationId: string;
  @ApiProperty()
  @IsOptional()
  controlNetImages: Express.Multer.File[];
  @ApiProperty({ type: Number, isArray: true })
  @IsOptional()
  controlnetImageStrengths: number[];
  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  controlnetIsPreprocessors: string[];
  @ApiProperty({ enum: ControlNetType, isArray: true })
  @IsOptional()
  controlNetTypes: ControlNetType[];
}
