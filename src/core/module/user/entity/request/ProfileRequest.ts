import { IsArray, IsOptional, IsString, isArray } from 'class-validator';
import { SocialRequest } from './SocialRequest';
import { User } from '../User';

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
  socials: SocialRequest[];

  public static updateFields(profile: ProfileRequest, user: User) {
    if (!profile.firstName) {
      profile.firstName = user.firstName;
    }
    if (!profile.lastName) {
      profile.lastName = user.lastName;
    }
    if (!profile.aliasName) {
      profile.aliasName = user.aliasName;
    }
    if (!profile.phone) {
      profile.phone = user.phone;
    }
    if (!profile.address) {
      profile.address = user.address;
    }
    if (!profile.description) {
      profile.description = user.description;
    }
  }
}
