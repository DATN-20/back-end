import { IsArray, IsString, isArray } from 'class-validator';
import { SocialRequest } from './SocialRequest';

export class ProfileRequest {
  @IsString()
  firstName: string;
  @IsString()
  aliasName: string;
  @IsString()
  lastName: string;
  @IsString()
  phone: string;
  @IsString()
  address: string;
  @IsString()
  description: string;
  @IsArray()
  socials: SocialRequest[];
}
