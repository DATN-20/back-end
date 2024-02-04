import { DrizzleAsyncProvider } from '@infrastructure/orm/DrizzleProvider';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '@infrastructure/orm/schema';

@Injectable()
export class BaseRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    protected readonly database: MySql2Database<typeof schema>,
  ) {}
}
