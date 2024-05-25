import { BaseRepository } from '@core/common/repository/BaseRepository';
import { LockedUser } from '../entity/LockedUser';
import { locked_users } from '@infrastructure/orm/schema';
import { LockUserType } from '@core/common/enum/LockUserType';
import { DateUtil } from '@core/common/util/DateUtil';
import { DateUnit } from '@core/common/enum/DateUnit';
import { Exception } from '@core/common/exception/Exception';
import { LockedUserError } from '@core/common/resource/error/LockedUserError';
import { eq } from 'drizzle-orm';

export class LockedUserRepository extends BaseRepository {
  async getByUserId(user_id: number): Promise<LockedUser> {
    return this.database.query.locked_users.findFirst({
      where: (locked_users, { eq }) => eq(locked_users.userId, user_id),
    });
  }

  async create(
    user_id: number,
    type: LockUserType = LockUserType.TEMPARORY,
    period?: number,
    date_unit?: DateUnit,
  ): Promise<LockedUser> {
    switch (type) {
      case LockUserType.PERMANENT:
        await this.database.insert(locked_users).values({
          userId: user_id,
          type,
        });
        break;
      case LockUserType.TEMPARORY:
        const locked_at = new Date();
        const expired_at = DateUtil.addDate(locked_at, period, date_unit);
        await this.database.insert(locked_users).values({
          userId: user_id,
          type,
          lockedAt: locked_at,
          expiredAt: expired_at,
        });
        break;
      default:
        throw new Exception(LockedUserError.INVALID_TYPE_LOCKED_USER);
    }

    return this.getByUserId(user_id);
  }

  async delete(user_id: number): Promise<void> {
    await this.database.delete(locked_users).where(eq(locked_users.userId, user_id));
  }

  async update(
    user_id: number,
    type: LockUserType = LockUserType.TEMPARORY,
    period?: number,
    date_unit?: DateUnit,
  ): Promise<LockedUser> {
    switch (type) {
      case LockUserType.PERMANENT:
        await this.database
          .update(locked_users)
          .set({
            userId: user_id,
            type,
          })
          .where(eq(locked_users.userId, user_id));
        break;
      case LockUserType.TEMPARORY:
        const locked_at = new Date();
        const expired_at = DateUtil.addDate(locked_at, period, date_unit);
        await this.database
          .update(locked_users)
          .set({
            type,
            lockedAt: locked_at,
            expiredAt: expired_at,
          })
          .where(eq(locked_users.userId, user_id));
        break;
      default:
        throw new Exception(LockedUserError.INVALID_TYPE_LOCKED_USER);
    }

    return this.getByUserId(user_id);
  }
}
