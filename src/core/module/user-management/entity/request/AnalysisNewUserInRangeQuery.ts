import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class AnalysisNewUserInRangeQuery {
  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
