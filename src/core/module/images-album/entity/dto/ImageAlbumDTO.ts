import { ImageType } from '@core/common/enum/ImageType';

export class ImageAlbumDTO {
  image: {
    id: number;
    createdAt: Date;
    userId: number;
    url: string;
    type: ImageType;
    prompt: string;
    aiName: string;
    style: string;
    additionInfo: string;
    visibility: boolean;
    storageId: string;
  };
  like: number;
}
