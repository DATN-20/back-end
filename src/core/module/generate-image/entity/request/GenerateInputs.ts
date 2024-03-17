import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
  negativePrompt: string;

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
}
