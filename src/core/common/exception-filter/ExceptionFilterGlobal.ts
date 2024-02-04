import { ExceptionFilter, Catch, ArgumentsHost, Global } from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../exception/Exception';

@Global()
@Catch(Exception)
export class ExceptionFilterGlobal implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const error = exception.error;

    response.status(error.status_code).json({
      ...error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
