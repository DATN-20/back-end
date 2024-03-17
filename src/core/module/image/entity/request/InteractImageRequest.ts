import { InteractionType } from '@core/common/enum/InteractionType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';

export class InteractImageRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  imageId: number;

  @ApiProperty()
  @IsEnum(InteractionType)
  type: InteractionType;
}
