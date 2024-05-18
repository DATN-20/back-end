import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetApiRequestTimesOfUserQuery {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}