import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputControlnet } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/InputControlnet';
import { ControlNetType } from '@infrastructure/external-services/ai-generate-image/comfyui/control-net/types/ControlNetType';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateByImagesStyleInputs {
  @ApiProperty()
  @IsNotEmpty()
  aiName: string;
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
  noise: number;
  @ApiProperty()
  @IsOptional()
  controlNets: InputControlnet[];
  @ApiProperty()
  @IsOptional()
  isUpscale: boolean;
  @ApiProperty()
  @IsOptional()
  imageToUnclipsImages: Express.Multer.File[];
  @ApiProperty()
  @IsOptional()
  imageToUnclipsStrengths: number[];
  @ApiProperty()
  @IsOptional()
  imageToUnclipsNoiseAugmentations: number[];
  @ApiProperty()
  @IsOptional()
  imageForIpadapters: Express.Multer.File[];
  @ApiProperty()
  @IsOptional()
  imageForIpadapterWeight: number[];
  @ApiProperty()
  @IsOptional()
  imageForIPAdapterCropPosition: string[];
  @ApiProperty()
  @IsOptional()
  generationId: string;
  @ApiProperty()
  @IsOptional()
  controlNetImages: Express.Multer.File[];
  @ApiProperty()
  @IsOptional()
  controlnetImageStrengths: number[];
  @ApiProperty()
  @IsOptional()
  controlnetIsPreprocessors: string[];
  @ApiProperty()
  @IsOptional()
  controlNetTypes: ControlNetType[];
}
