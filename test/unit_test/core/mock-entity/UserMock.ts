import { User } from '@core/module/user/entity/User';
import { IMockEntity } from './IMockEntity';
import { UserRole } from '@core/common/enum/UserRole';
import { RandomNumber } from '../utils/RandomNumber';
import { RandomString } from '../utils/RandomString';

export class UserMock implements IMockEntity<User> {
  mock(): User {
    return {
      id: RandomNumber.randomNumber(),
      email: `${RandomString.randomString()}@gmail.com`,
      password: RandomString.randomString(),
      firstName: RandomString.randomString(),
      lastName: RandomString.randomString(),
      aliasName: RandomString.randomString(),
      phone: null,
      address: RandomString.randomString(),
      description: RandomString.randomString(),
      socials: [],
      role: UserRole.ARTIST,
      refeshToken: RandomString.randomString(),
      accessToken: RandomString.randomString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://artirst.com/${RandomString.randomString()}.jpeg`,
      background: `https://artirst.com/${RandomString.randomString()}.jpeg`,
    };
  }

  mockArray(length: number): User[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const entity = this.mock();
      result.push(entity);
    }

    return result;
  }
}
