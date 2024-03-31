import { IsNotEmpty, IsString } from 'class-validator';

export class SocialRequest {
  @IsNotEmpty()
  @IsString()
  socialName: string;

  @IsNotEmpty()
  @IsString()
  socialLink: string;
}
