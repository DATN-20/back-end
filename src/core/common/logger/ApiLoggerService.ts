import * as winston from 'winston';
import { ApiLogProperty } from './ApiLoggerProperty';

const ApiLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info: ApiLogProperty) => {
      const logObject = {
        timestamp: info.timestamp,
        message: info.message,
        level: info.level.toUpperCase(),
        user_id: info.user_id,
        endpoint: info.api_endpoint,
      };
      return JSON.stringify(logObject);
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'api-logs/api.log' }),
  ],
});

export default ApiLogger;
