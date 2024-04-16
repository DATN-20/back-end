import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProcessType } from '../ProcessType';

export class ProcessImageRequest {
  @IsNotEmpty()
  @IsEnum(ProcessType)
  processType: ProcessType;
}
