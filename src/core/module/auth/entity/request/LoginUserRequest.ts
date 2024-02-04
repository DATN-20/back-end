import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
