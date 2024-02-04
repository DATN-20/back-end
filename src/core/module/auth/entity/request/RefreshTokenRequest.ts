import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty()
  token: string;
}
