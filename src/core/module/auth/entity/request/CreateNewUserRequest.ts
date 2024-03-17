import { CreateUserPayload } from '@core/common/util/jwt/JwtUtil';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
