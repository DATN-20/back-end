import { LogType } from '../enum/LogType';

export interface SystemLogProperty {
  timestamp: string;
  message: string;
  level: string;
  error_code: string;
  back_trace: string;
  log_type: LogType;
}
