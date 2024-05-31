import { TrimValidator } from '@core/common/decorator/TrimValidator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class SocialRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  socialName: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @TrimValidator()
  @ValidateIf(req => req.socialLink !== '')
  @IsUrl()
  socialLink: string = '';
}
