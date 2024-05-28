import { TrimValidator } from '@core/common/decorator/TrimValidator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumReq {
  @TrimValidator()
  @IsNotEmpty()
  @IsString()
  name: string;
}
