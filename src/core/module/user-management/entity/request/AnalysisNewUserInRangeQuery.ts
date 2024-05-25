import { IsDate, IsNotEmpty } from 'class-validator';

export class AnalysisNewUserInRangeQuery {
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
