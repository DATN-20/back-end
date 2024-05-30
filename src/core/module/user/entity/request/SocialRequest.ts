import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  socialName: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  socialLink: string = '';
}
