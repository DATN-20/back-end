import { IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { ApiProperty } from '@nestjs/swagger';
import { TrimValidator } from '@core/common/decorator/TrimValidator';

export class ChangePasswordRequest {
  @ApiProperty()
  @TrimValidator()
  @IsNotEmpty()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;

  @ApiProperty()
  @TrimValidator()
  @IsNotEmpty()
  @IsString()
  token: string;
}
