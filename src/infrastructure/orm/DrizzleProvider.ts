import mysql from 'mysql2/promise';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async (): Promise<MySql2Database<typeof schema>> => {
      const poolConnection = mysql.createPool({
        host: DatabaseConfig.DATABASE_HOST,
        user: DatabaseConfig.DATABASE_USER,
        database: DatabaseConfig.DATABASE_NAME,
        password: DatabaseConfig.DATABASE_PASSWORD,
        port: DatabaseConfig.DATABASE_PORT,
        charset: 'utf8mb4',
        keepAliveInitialDelay: 3 * 1000,
        enableKeepAlive: true,
        maxIdle: 10,
        connectionLimit: 10,
      });

      const db = drizzle(poolConnection, { schema, mode: 'default' });

      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
