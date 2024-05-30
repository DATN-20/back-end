import { ApiProperty } from '@nestjs/swagger';

export class AnalysisWithDateJson {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  total: number;
}

export class AnalysisWithQueryJson {
  @ApiProperty()
  endpoint?: string;
  @ApiProperty()
  start_date: Date;
  @ApiProperty()
  end_date: Date;
  @ApiProperty()
  data: AnalysisWithDateJson[];
}
