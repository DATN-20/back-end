import SystemLogger from '@core/common/logger/SystemLoggerService';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { EnvironmentUtil } from '@core/common/util/EnvironmentUtil';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const FOLDER_NAME_DATA_BACKUP = 'backup-data';

@Injectable()
export class BackUpDataService implements OnModuleInit {
  private readonly logger = new Logger(BackUpDataService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async execute(): Promise<void> {
    const backup_dir = path.resolve(process.cwd(), FOLDER_NAME_DATA_BACKUP);
    if (!fs.existsSync(backup_dir)) {
      fs.mkdirSync(backup_dir);
    }

    const backup_file = path.join(backup_dir, `backup_${Date.now()}.sql`);
    const command = `mysqldump -u ${DatabaseConfig.DATABASE_USER} -p${DatabaseConfig.DATABASE_PASSWORD} ${DatabaseConfig.DATABASE_NAME} > ${backup_file}`;

    exec(command, (error, _stdout, _stderr) => {
      if (error) {
        SystemLogger.error(error.message, {
          error_code: ErrorBaseSystem.FAILED_BACKUP_DATA.error_code,
          back_trace: error.stack,
        });
        return;
      }
    });
  }

  onModuleInit() {
    if (EnvironmentUtil.isDevMode()) {
      return;
    }

    this.execute();
  }
}
