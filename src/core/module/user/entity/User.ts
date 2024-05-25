import { LockedUser } from '@core/module/user-management/entity/LockedUser';
import { users } from '@infrastructure/orm/schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
export type UserWithLockedInformation = {
  user: User;
  lockedInformation: LockedUser;
};
