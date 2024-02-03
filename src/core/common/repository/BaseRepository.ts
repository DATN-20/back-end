import { DrizzleAsyncProvider } from '@infrastructure/orm/DrizzleProvider';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class BaseRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) protected readonly db: MySql2Database,
  ) {}
}
