import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseRepository } from '../repository/BaseRepository';
import SystemLogger from '../logger/SystemLoggerService';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { LogType } from '../enum/LogType';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly database: BaseRepository) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    await this.database.startTransaction();

    return next.handle().pipe(
      tap(async () => {
        await this.database.commitTransaction();
      }),
      tap({
        error: async error => {
          SystemLogger.error(error.message, {
            error_code: ErrorBaseSystem.INTERNAL_SERVER_ERROR.error_code,
            back_trace: error.stack,
            log_type: LogType.SYSTEM,
          });

          await this.database.rollBackTransaction();
          await this.database.releaseTransaction();
        },
      }),
    );
  }
}
