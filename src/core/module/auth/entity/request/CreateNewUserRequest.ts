import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';

export class CreateNewUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
