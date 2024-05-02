import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnlockUserRequest {
  @IsNotEmpty()
  @IsNumber()
  lockedUserId: number;
}
