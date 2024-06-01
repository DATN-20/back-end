import { IMockEntity } from './IMockEntity';
import { RandomString } from '../utils/RandomString';
import { Album } from '@core/module/album/entity/Album';
import { RandomNumber } from '../utils/RandomNumber';

export class AlbumMock implements IMockEntity<Album> {
  mockArray(length: number): Album[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const entity = this.mock();
      result.push(entity);
    }

    return result;
  }

  mock(): Album {
    return {
      id: RandomNumber.randomNumber(),
      name: RandomString.randomString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: RandomNumber.randomNumber(),
    };
  }
}
