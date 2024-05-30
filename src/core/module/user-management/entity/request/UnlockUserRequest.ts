import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnlockUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lockedUserId: number;
}
