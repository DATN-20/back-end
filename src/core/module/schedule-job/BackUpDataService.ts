import SystemLogger from '@core/common/logger/SystemLoggerService';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackUpDataService implements OnModuleInit {
  private readonly logger = new Logger(BackUpDataService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async execute(): Promise<void> {
    this.logger.log('Processing the backup data...');

    const backup_dir = path.resolve(process.cwd(), 'backup-data');
    if (!fs.existsSync(backup_dir)) {
      fs.mkdirSync(backup_dir);
    }

    const command = `mysqldump -u ${DatabaseConfig.DATABASE_USER} -p${
      DatabaseConfig.DATABASE_PASSWORD
    } ${DatabaseConfig.DATABASE_NAME} > backup-data/backup_${Date.now()}.sql`;

    exec(command, (error, _stdout, _stderr) => {
      if (error) {
        SystemLogger.error(error.message, {
          error_code: ErrorBaseSystem.FAILED_BACKUP_DATA.error_code,
          back_trace: error.stack,
        });
        return;
      }

      this.logger.log('Backup process completed successfully');
    });
  }

  onModuleInit() {
    this.execute();
  }
}
