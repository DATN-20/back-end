import { IsNotEmpty, IsString } from 'class-validator';

export class SocialRequest {
  @IsNotEmpty()
  @IsString()
  social_name: string;

  @IsNotEmpty()
  @IsString()
  social_link: string;
}
