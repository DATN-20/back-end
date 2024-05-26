import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialRequest {
  @IsNotEmpty()
  @IsString()
  socialName: string;

  @IsOptional()
  socialLink: string = '';
}
