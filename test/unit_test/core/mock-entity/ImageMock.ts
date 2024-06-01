import { Image } from '@core/module/image/entity/Image';
import { IMockEntity } from './IMockEntity';
import { RandomString } from '../utils/RandomString';
import { ImageType } from '@core/common/enum/ImageType';
import { ComfyUIInfo } from '@infrastructure/external-services/ai-generate-image/comfyui/info/ComfyUIInfo';

export class ImageMock implements IMockEntity<Image> {
  mockArray(length: number): Image[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const entity = this.mock();
      result.push(entity);
    }

    return result;
  }

  mock(): Image {
    return {
      userId: 1,
      url: RandomString.randomUrl(),
      id: 1,
      createdAt: new Date(),
      type: ImageType.TEXT_TO_IMG,
      prompt: RandomString.randomString(),
      aiName: new ComfyUIInfo().ai_name,
      style: RandomString.randomString(),
      additionInfo: RandomString.randomString(),
      visibility: true,
      storageId: RandomString.randomString(),
      generateId: RandomString.randomString(),
      removeBackground: null,
      upscale: null,
    };
  }
}
