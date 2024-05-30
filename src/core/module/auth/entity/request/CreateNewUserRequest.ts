import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';
import { UserRole } from '@core/common/enum/UserRole';
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

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
