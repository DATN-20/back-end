import { LockUserType } from '@core/common/enum/LockUserType';
import { LockedUser } from '../LockedUser';
import { LockedUserJson } from './LockedUserJson';

export class LockedUserResponse {
  private userId: number;
  private type: LockUserType;
  private lockedAt: Date;
  private expiredAt: Date;

  constructor(user_id: number, type: LockUserType, locked_at: Date, expired_at: Date) {
    this.userId = user_id;
    this.type = type;
    this.lockedAt = locked_at;
    this.expiredAt = expired_at;
  }

  public static convertFromLockedUserEntity(locked_user: LockedUser): LockedUserResponse {
    return new LockedUserResponse(
      locked_user.userId,
      locked_user.type,
      locked_user.lockedAt,
      locked_user.expiredAt,
    );
  }

  public toJson(): LockedUserJson {
    return {
      user_id: this.userId,
      type: this.type,
      locked_at: this.lockedAt,
      expired_at: this.expiredAt,
    };
  }
}
