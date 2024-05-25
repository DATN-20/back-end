export interface LogMonitoringJson {
  user_id: number;
  requested_at: Date;
  endpoint: string;
  severity: string;
  message: string;
  file: string;
}
