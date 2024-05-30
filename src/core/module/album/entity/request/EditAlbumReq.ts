import { TrimValidator } from '@core/common/decorator/TrimValidator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditAlbumReq {
  @ApiProperty()
  @TrimValidator()
  @IsNotEmpty()
  @IsString()
  name: string;
}
