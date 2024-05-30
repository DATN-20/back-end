import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
