import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProcessType } from '../ProcessType';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessImageRequest {
  @ApiProperty({ default: ProcessType.UPSCALE })
  @IsNotEmpty()
  @IsEnum(ProcessType)
  processType: ProcessType;
}
