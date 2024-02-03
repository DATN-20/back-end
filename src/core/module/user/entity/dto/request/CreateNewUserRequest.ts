import { IsString } from 'class-validator';

export class CreateNewUserRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
