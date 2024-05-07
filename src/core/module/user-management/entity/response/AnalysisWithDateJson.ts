export interface AnalysisWithDateJson {
  date: Date;
  total: number;
}

export interface AnalysisWithQueryJson {
  endpoint?: string;
  start_date: Date;
  end_date: Date;
  data: AnalysisWithDateJson[];
}
