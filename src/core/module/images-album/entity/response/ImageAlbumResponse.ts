import { ImageType } from '@core/common/enum/ImageType';
import { VisibilityType } from '@core/common/enum/VisibilityType';
import { Image } from '@core/module/image/entity/Image';

export class ImageAlbumResponse {
  image: {
    id: number;
    createdAt: Date;
    userId: number;
    url: string;
    type: ImageType; // Assuming ImageType is another type defined elsewhere
    prompt: string;
    aiName: string;
    style: string;
    additionInfo: string;
    visibility: boolean; // Assuming VisibilityType is another type defined elsewhere
    storageId: string;
  };
  like: number;
  //   constructor(image: Image[], like: number) {
  //     this.image = image;
  //     this.like = like;
  //   }
}
