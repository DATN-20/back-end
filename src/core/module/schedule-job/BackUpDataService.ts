import SystemLogger from '@core/common/logger/SystemLoggerService';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class BackUpDataService implements OnModuleInit {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(BackUpDataService.name);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async execute(): Promise<void> {
    this.logger.log('Processing the backup data...');

    exec(
      `mysqldump -u ${DatabaseConfig.DATABASE_USER} -p${DatabaseConfig.DATABASE_PASSWORD} ${
        DatabaseConfig.DATABASE_NAME
      } > backup_${Date.now()}.sql`,
      (error, stdout, stderr) => {
        if (error) {
          SystemLogger.error(error.message, {
            error_code: ErrorBaseSystem.FAILED_BACKUP_DATA.error_code,
            back_trace: error.stack,
          });
          return;
        }
        if (stderr) {
          SystemLogger.error(stderr, {
            error_code: ErrorBaseSystem.FAILED_BACKUP_DATA.error_code,
            back_trace: null,
          });
          return;
        }
        this.logger.log('Backup process completed successfully');
      },
    );
  }

  onModuleInit() {
    this.execute();
  }
}
