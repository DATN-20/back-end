import { IMockEntity } from './IMockEntity';
import { RandomString } from '../utils/RandomString';
import { RandomNumber } from '../utils/RandomNumber';
import { Generation } from '@core/module/generation/entity/Generation';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';

export class GenerationMock implements IMockEntity<Generation> {
  mockArray(length: number): Generation[] {
    const result = [];
    const user_id = RandomNumber.randomNumber();

    for (let i = 0; i < length; i++) {
      const notifcation = this.mock();
      notifcation.userId = user_id;
      result.push(notifcation);
    }

    return result;
  }

  mock(): Generation {
    return {
      id: RandomString.randomString(),
      status: GenerationStatus.WAITING,
      createdAt: new Date(),
      userId: RandomNumber.randomNumber(),
      isSentMail: true,
      isNotification: true,
    };
  }
}
