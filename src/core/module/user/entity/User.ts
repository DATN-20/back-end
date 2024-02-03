import { users } from '@infrastructure/orm/schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
