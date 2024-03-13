import { AiType } from '@core/common/enum/AiType';
import { ModelType } from '@core/common/enum/ModelType';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAiModelRequest {
  @IsNotEmpty()
  name: string;

  @IsEnum(AiType)
  aiName: AiType;

  @IsEnum(ModelType)
  type: ModelType;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  label: string;
}
