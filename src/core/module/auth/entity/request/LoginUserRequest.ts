import { IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';

export class LoginUserRequest {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
