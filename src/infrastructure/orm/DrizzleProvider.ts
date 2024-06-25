import { createConnection } from 'mysql2/promise';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const dizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async (): Promise<MySql2Database<typeof schema>> => {
      const connection = await createConnection({
        host: DatabaseConfig.DATABASE_HOST,
        user: DatabaseConfig.DATABASE_USER,
        database: DatabaseConfig.DATABASE_NAME,
        password: DatabaseConfig.DATABASE_PASSWORD,
        port: DatabaseConfig.DATABASE_PORT,
        charset: 'utf8mb4',
        keepAliveInitialDelay: 100000,
        enableKeepAlive: true,
      });

      const db = drizzle(connection, { schema, mode: 'default' });
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
