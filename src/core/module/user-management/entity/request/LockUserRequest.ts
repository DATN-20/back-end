import { DateUnit } from '@core/common/enum/DateUnit';
import { LockUserType } from '@core/common/enum/LockUserType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class LockUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lockedUserId: number;

  @ApiProperty()
  @IsEnum(LockUserType)
  type: LockUserType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(DateUnit)
  unit: DateUnit;
}
