import { InteractionType } from '@core/common/enum/InteractionType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class InteractImageRequest {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  imageId: number;

  @ApiProperty({ default: InteractionType.LIKE, enum: InteractionType })
  @IsEnum(InteractionType)
  type: InteractionType;
}
