import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { SystemLogProperty } from './SystemLoggerProperty';

const SystemLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info: SystemLogProperty) => {
      const logObject = {
        timestamp: info.timestamp,
        message: info.message,
        level: info.level.toUpperCase(),
        error_code: info.error_code,
        back_trace: info.back_trace,
      };
      return JSON.stringify(logObject);
    }),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/system.log' }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_URL },
    }),
  ],
});

export default SystemLogger;
