import { LogType } from '../enum/LogType';

export interface ApiLogProperty {
  timestamp: string;
  message: string;
  level: string;
  user_id: number;
  api_endpoint: string;
  log_type: LogType;
}
