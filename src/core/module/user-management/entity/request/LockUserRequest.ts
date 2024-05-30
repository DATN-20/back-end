import { DateUnit } from '@core/common/enum/DateUnit';
import { LockUserType } from '@core/common/enum/LockUserType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class LockUserRequest {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  lockedUserId: number;

  @ApiProperty({ enum: LockUserType, default: LockUserType.TEMPARORY })
  @IsEnum(LockUserType)
  type: LockUserType;

  @ApiProperty({ type: Number, default: 1 })
  @IsOptional()
  @IsNumber()
  period: number;

  @ApiProperty({ enum: DateUnit, default: DateUnit.DAYS })
  @IsOptional()
  @IsEnum(DateUnit)
  unit: DateUnit;
}
