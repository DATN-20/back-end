import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { SystemLogProperty } from './SystemLoggerProperty';
import { ElasticSearchConfig } from '@infrastructure/config/ElasticSearchConfig';

const SystemLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info: SystemLogProperty): string => {
      const logObject = {
        timestamp: info.timestamp,
        message: info.message,
        level: info.level.toUpperCase(),
        error_code: info.error_code,
        back_trace: info.back_trace,
        log_type: info.log_type,
      };
      return JSON.stringify(logObject);
    }),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/system.log' }),
    new ElasticsearchTransport({
      level: 'error',
      clientOpts: { node: ElasticSearchConfig.ELASTICSEARCH_URL },
    }),
  ],
});

export default SystemLogger;
