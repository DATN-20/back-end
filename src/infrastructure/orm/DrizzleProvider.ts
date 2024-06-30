import { createConnection } from 'mysql2/promise';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import SystemLogger from '@core/common/logger/SystemLoggerService';
import { DatabaseError } from '@core/common/resource/error/DatabaseError';
import { LogType } from '@core/common/enum/LogType';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async (): Promise<MySql2Database<typeof schema>> => {
      const createDbConnection = async () => {
        const connection = await createConnection({
          host: DatabaseConfig.DATABASE_HOST,
          user: DatabaseConfig.DATABASE_USER,
          database: DatabaseConfig.DATABASE_NAME,
          password: DatabaseConfig.DATABASE_PASSWORD,
          port: DatabaseConfig.DATABASE_PORT,
          charset: 'utf8mb4',
          keepAliveInitialDelay: 3 * 1000,
          enableKeepAlive: true,
          idleTimeout: 5 * 60 * 1000,
          maxIdle: 0,
        });

        connection.on('error', async err => {
          if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            SystemLogger.error(err.message, {
              error_code: DatabaseError.DATABASE_CONNECTION_LOST.error_code,
              back_trace: 'src/infrastructure/orm/DrizzleProvider.ts',
              log_type: LogType.SYSTEM,
            });
            await createDbConnection();
          } else {
            throw err;
          }
        });

        return connection;
      };

      const connection = await createDbConnection();
      const db = drizzle(connection, { schema, mode: 'default' });

      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
