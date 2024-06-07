import { ExceptionFilter, Catch, ArgumentsHost, Global } from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../exception/Exception';
import { EnvironmentType } from '../enum/EvironmentType';
import SystemLogger from '../logger/SystemLoggerService';
import { LogType } from '../enum/LogType';

@Global()
@Catch(Exception)
export class ExceptionFilterGlobal implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const error = exception.error;

    SystemLogger.error(error.message, {
      error_code: error.error_code,
      back_trace: exception.stack,
      log_type: LogType.SYSTEM,
    });

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
        back_trace: exception.stack,
      });
    }
  }
}
