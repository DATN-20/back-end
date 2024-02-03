import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import 'dotenv/config';
import type { Config } from 'drizzle-kit';
export default {
  schema: './src/infrastructure/orm/schema.ts',
  out: './src/infrastructure/orm/migration',
  driver: 'mysql2',
  dbCredentials: {
    host: DatabaseConfig.DATABASE_HOST,
    user: DatabaseConfig.DATABASE_USER,
    password: DatabaseConfig.DATABASE_PASSWORD,
    database: DatabaseConfig.DATABASE_NAME,
    port: DatabaseConfig.DATABASE_PORT,
  },
  verbose: true,
  strict: true,
} satisfies Config;
