import { DateUnit } from '@core/common/enum/DateUnit';
import { LockUserType } from '@core/common/enum/LockUserType';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class LockUserRequest {
  @IsNotEmpty()
  @IsNumber()
  lockedUserId: number;

  @IsEnum(LockUserType)
  type: LockUserType;

  @IsOptional()
  @IsNumber()
  period: number;

  @IsOptional()
  @IsEnum(DateUnit)
  unit: DateUnit;
}
