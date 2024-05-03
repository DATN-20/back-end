import { LockedUser } from '../LockedUser';
import { LockedUserJson } from './LockedUserJson';

export class LockedUserResponse {
  public static convertFromLockedUserEntity(locked_user: LockedUser): LockedUserJson {
    return {
      user_id: locked_user.userId,
      type: locked_user.type,
      locked_at: locked_user.lockedAt,
      expired_at: locked_user.expiredAt,
    };
  }
}
