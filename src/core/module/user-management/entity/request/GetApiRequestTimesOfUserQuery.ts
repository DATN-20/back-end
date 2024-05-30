import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetApiRequestTimesOfUserQuery {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
