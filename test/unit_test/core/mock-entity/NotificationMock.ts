import { IMockEntity } from './IMockEntity';
import { RandomString } from '../utils/RandomString';
import { RandomNumber } from '../utils/RandomNumber';
import { NotificationEntity } from '@core/module/notifications/entity/Notification';
import { NotificationType } from '@core/common/enum/NotificationType';

export class NotificationMock implements IMockEntity<NotificationEntity> {
  mockArray(length: number): NotificationEntity[] {
    const result = [];
    const user_id = RandomNumber.randomNumber();

    for (let i = 0; i < length; i++) {
      const notifcation = this.mock();
      notifcation.userId = user_id;
      result.push(notifcation);
    }

    return result;
  }

  mock(): NotificationEntity {
    return {
      id: RandomNumber.randomNumber(),
      title: RandomString.randomString(),
      content: RandomString.randomString(),
      createdAt: new Date(),
      userId: RandomNumber.randomNumber(),
      redirectUrl: RandomString.randomString(),
      isRead: false,
      type: NotificationType.GENERATION,
      referenceData: null,
    };
  }
}
