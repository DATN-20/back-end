import { DrizzleAsyncProvider } from '@infrastructure/orm/DrizzleProvider';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import * as schema from '@infrastructure/orm/schema';
import { ITransaction } from './ITransaction';
import { sql } from 'drizzle-orm';

@Injectable()
export class BaseRepository implements ITransaction<MySqlRawQueryResult> {
  constructor(
    @Inject(DrizzleAsyncProvider)
    protected readonly database: MySql2Database<typeof schema>,
  ) {}

  async startTransaction(): Promise<MySqlRawQueryResult> {
    return this.database.execute(sql`START TRANSACTION`);
  }

  async commitTransaction(): Promise<MySqlRawQueryResult> {
    return this.database.execute(sql`COMMIT`);
  }

  async rollBackTransaction(): Promise<MySqlRawQueryResult> {
    return this.database.execute(sql`ROLLBACK`);
  }

  async releaseTransaction(): Promise<MySqlRawQueryResult> {
    return this.database.execute(sql`RELEASE`);
  }
}
