import { IsDate, IsNotEmpty } from 'class-validator';

export class AnalysisNewUserInRangeQuery {
  @IsNotEmpty()
  @IsDate()
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  end_date: Date;
}
