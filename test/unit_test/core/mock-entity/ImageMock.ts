import { Image } from '@core/module/image/entity/Image';
import { IMockEntity } from './IMockEntity';
import { RandomString } from '../utils/RandomString';
import { ImageType } from '@core/common/enum/ImageType';
import { ComfyUIInfo } from '@infrastructure/external-services/ai-generate-image/comfyui/info/ComfyUIInfo';
import { RandomNumber } from '../utils/RandomNumber';

export class ImageMock implements IMockEntity<Image> {
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
      generateId: RandomNumber.randomNumber(),
      removeBackground: null,
      upscale: null,
    };
  }
}