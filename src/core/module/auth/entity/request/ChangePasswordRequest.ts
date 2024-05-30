import { IsNotEmpty, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiProperty()
  @IsNotEmpty()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
