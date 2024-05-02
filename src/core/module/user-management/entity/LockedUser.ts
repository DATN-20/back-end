import { locked_users } from '@infrastructure/orm/schema';
import { InferSelectModel } from 'drizzle-orm';

export type LockedUser = InferSelectModel<typeof locked_users>;
