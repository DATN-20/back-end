import { IsNotEmpty, Length } from 'class-validator';
import { AuthConstant } from '../../AuthConstant';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @Length(AuthConstant.MIN_LENGTH_PASSWORD)
  password: string;
}
