import { LockUserType } from '@core/common/enum/LockUserType';

export interface LockedUserJson {
  user_id: number;
  type: LockUserType;
  locked_at: Date;
  expired_at: Date;
}
