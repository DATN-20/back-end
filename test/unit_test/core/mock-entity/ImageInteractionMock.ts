import { ImageInteraction } from '@core/module/images-interaction/entity/ImageInteraction';
import { IMockEntity } from './IMockEntity';
import { InteractionType } from '@core/common/enum/InteractionType';
import { RandomNumber } from '../utils/RandomNumber';

export class ImageInteractionMock implements IMockEntity<ImageInteraction> {
  mock(): ImageInteraction {
    return {
      updatedAt: new Date(),
      userId: RandomNumber.randomNumber(),
      type: InteractionType.LIKE,
      imageId: RandomNumber.randomNumber(),
    };
  }

  mockArray(length: number): ImageInteraction[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const entity = this.mock();
      result.push(entity);
    }

    return result;
  }
}
