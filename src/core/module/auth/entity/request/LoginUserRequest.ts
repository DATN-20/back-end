import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
