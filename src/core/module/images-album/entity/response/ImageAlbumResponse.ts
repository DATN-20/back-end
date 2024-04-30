import { ImageType } from '@core/common/enum/ImageType';
import { ImageAlbumDTO } from '../dto/ImageAlbumDTO';

export class ImageAlbumResponse {
  image: {
    id: number;
    createdAt: Date;
    userId: number;
    url: string;
    type: ImageType;
    prompt: string;
    ai_name: string;
    style: string;
    additionInfo: string;
    visibility: boolean;
    storageId: string;
  };
  like: number;

  public static convertFromImageAlbumDTO(imageAlbumDTO: ImageAlbumDTO) {
    return {
      image: {
        id: imageAlbumDTO.image.id,
        createdAt: imageAlbumDTO.image.createdAt,
        userId: imageAlbumDTO.image.userId,
        url: imageAlbumDTO.image.url,
        type: imageAlbumDTO.image.type,
        prompt: imageAlbumDTO.image.prompt,
        ai_name: imageAlbumDTO.image.aiName,
        style: imageAlbumDTO.image.style,
        additionInfo: imageAlbumDTO.image.additionInfo,
        visibility: imageAlbumDTO.image.visibility,
        storageId: imageAlbumDTO.image.storageId,
      },
      like: imageAlbumDTO.like,
    };
  }
}
