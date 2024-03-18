import { InteractionType } from '@core/common/enum/InteractionType';
import { IsBooleanString, IsEnum, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class InteractImageRequest {
  @IsNotEmpty()
  @IsNumberString()
  imageId: number;

  @IsEnum(InteractionType)
  type: InteractionType;
}
