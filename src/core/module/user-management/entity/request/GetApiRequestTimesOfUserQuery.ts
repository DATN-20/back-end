import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetApiRequestTimesOfUserQuery {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ default: '/generate-image/image-to-image' })
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @ApiProperty({ default: new Date(), type: Date })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ default: new Date(), type: Date })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
