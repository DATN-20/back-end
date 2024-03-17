import { AiType } from '@core/common/enum/AiType';
import { ModelType } from '@core/common/enum/ModelType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAiModelRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(AiType)
  aiName: AiType;

  @ApiProperty()
  @IsEnum(ModelType)
  type: ModelType;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  label: string;
}
