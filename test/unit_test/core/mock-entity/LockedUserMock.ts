import { IMockEntity } from './IMockEntity';
import { RandomNumber } from '../utils/RandomNumber';
import { LockedUser } from '@core/module/user-management/entity/LockedUser';
import { LockUserType } from '@core/common/enum/LockUserType';
import { DateUtil } from '@core/common/util/DateUtil';
import { DateUnit } from '@core/common/enum/DateUnit';

export class LockedUserMock implements IMockEntity<LockedUser> {
  mockArray(length: number): LockedUser[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const entity = this.mock();
      result.push(entity);
    }

    return result;
  }

  mock(): LockedUser {
    return {
      userId: RandomNumber.randomNumber(),
      lockedAt: new Date(),
      type: LockUserType.TEMPARORY,
      expiredAt: DateUtil.addDate(
        new Date(),
        RandomNumber.randomNumberWithRange(1, 2),
        DateUnit.DAYS,
      ),
    };
  }
}
