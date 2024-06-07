import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SocialRequest } from './SocialRequest';
import { User } from '../User';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TrimValidator } from '@core/common/decorator/TrimValidator';
import { MININUM_STRING } from '@core/common/constant/Constant';

export class ProfileRequest {
  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.firstName !== '')
  @IsString()
  @MinLength(MININUM_STRING)
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.aliasName !== '')
  @IsString()
  @MinLength(MININUM_STRING)
  aliasName: string;

  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.lastName !== '')
  @IsString()
  @MinLength(MININUM_STRING)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.phone !== '')
  @IsPhoneNumber('VN')
  @MinLength(MININUM_STRING)
  phone: string;

  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.address !== '')
  @IsString()
  @MinLength(MININUM_STRING)
  address: string;

  @ApiProperty()
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.description !== '')
  @IsString()
  @MinLength(MININUM_STRING)
  description: string;

  @ApiProperty()
  @IsOptional()
  @ValidateIf(req => req.socials.length > 0)
  @IsArray()
  @Type(() => SocialRequest)
  @ValidateNested({ each: true })
  socials: SocialRequest[] = [];

  public static updateFields(profile: ProfileRequest, user: User) {
    profile.firstName ??= user.firstName;
    profile.lastName ??= user.lastName;
    profile.aliasName ??= user.aliasName;
    profile.phone ??= profile.phone;
    profile.address ??= profile.address;
    profile.description ??= profile.description;
  }
}
