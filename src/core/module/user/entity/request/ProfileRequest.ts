import { IsArray, IsOptional, IsString, ValidateNested, isArray } from 'class-validator';
import { SocialRequest } from './SocialRequest';
import { User } from '../User';
import { Type } from 'class-transformer';

export class ProfileRequest {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  aliasName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description: string;

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
