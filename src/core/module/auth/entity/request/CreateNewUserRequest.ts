import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { UserRole } from '@core/common/enum/UserRole';

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

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
