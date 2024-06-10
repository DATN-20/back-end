import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../exception/Exception';
import { GenerationError } from '../resource/error/GenerationError';
import { RedisRateLimiterStorage } from '../rate-limter/RedisRateLimiterStorage';
import { UserFromAuthGuard } from '../type/UserFromAuthGuard';
import { EnvironmentType } from '../enum/EvironmentType';
import SystemLogger from '../logger/SystemLoggerService';
import { LogType } from '../enum/LogType';

@Catch(Exception)
export class ExceptionFilterRateLimiter implements ExceptionFilter {
  constructor(private readonly redisRateLimiterStorage: RedisRateLimiterStorage) {}

  async catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const user = request['user'] as UserFromAuthGuard;
    const error = exception.error;

    SystemLogger.error(error.message, {
      error_code: error.error_code,
      back_trace: exception.stack,
      log_type: LogType.SYSTEM,
    });

    if (error.error_code === GenerationError.REACH_TO_MAXIMUM_TIMES.error_code) {
      await this.redisRateLimiterStorage.increment(
        {
          userId: user.id,
          ipAddress: request.ip,
        },
        request.url,
      );
    }

    if (process.env.NODE_ENV === EnvironmentType.PRODUCTION) {
      response.status(error.status_code).json({
        error_code: error.error_code,
        message: error.message,
        status_code: error.status_code,
      });
    } else {
      response.status(error.status_code).json({
        ...error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
