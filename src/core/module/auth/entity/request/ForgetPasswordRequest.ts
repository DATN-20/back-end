import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
