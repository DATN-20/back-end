import * as winston from 'winston';
import { ApiLogProperty } from './ApiLoggerProperty';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { LogType } from '../enum/LogType';

const ApiLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info: ApiLogProperty): string => {
      const logObject = {
        timestamp: info.timestamp,
        message: info.message,
        level: info.level.toUpperCase(),
        user_id: info.user_id,
        endpoint: info.api_endpoint,
        log_type: info.log_type,
      };
      return JSON.stringify(logObject);
    }),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/api.json' }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_URL },
    }),
  ],
});

export default ApiLogger;
