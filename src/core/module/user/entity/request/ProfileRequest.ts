import { IsArray, IsOptional, IsString, ValidateNested, isArray } from 'class-validator';
import { SocialRequest } from './SocialRequest';
import { User } from '../User';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  aliasName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  @Type(() => SocialRequest)
  @ValidateNested({ each: true })
  @IsOptional()
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
