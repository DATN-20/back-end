import * as winston from 'winston';
import { ApiLogProperty } from './ApiLoggerProperty';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { ElasticSearchConfig } from '@infrastructure/config/ElasticSearchConfig';
import { Logger } from '@nestjs/common';

const logger = new Logger('ApiLogger');

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
    new winston.transports.File({ filename: 'logs/api.log' }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: ElasticSearchConfig.ELASTICSEARCH_URL },
    }),
  ],
});

ApiLogger.on('error', err => {
  logger.error('Winston Elasticsearch transport error:', err);
});

export default ApiLogger;
