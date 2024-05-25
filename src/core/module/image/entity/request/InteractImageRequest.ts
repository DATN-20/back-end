import { InteractionType } from '@core/common/enum/InteractionType';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class InteractImageRequest {
  @IsNotEmpty()
  @IsNumber()
  imageId: number;

  @IsEnum(InteractionType)
  type: InteractionType;
}
