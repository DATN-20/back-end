import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ImageAlbumRepository } from './ImageAlbumRepository';
import { ImageAlbumRequest } from './entity/request/ImageAlbumRequest';
import { AlbumMessage } from '@core/common/resource/message/AlbumMessage';
import { AlbumError } from '@core/common/resource/error/AlbumError';
import { Exception } from '@core/common/exception/Exception';
import { AlbumService } from '../album/AlbumService';
import { ImageAlbumResponse } from './entity/response/ImageAlbumResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { ImageResponseJson } from '../image/entity/response/ImageResponseJson';

@Injectable()
export class ImageAlbumService {
  public constructor(
    private readonly imageAlbumRepository: ImageAlbumRepository,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  public async addImageToAlbum(
    user_id: number,
    album_id: number,
    request: ImageAlbumRequest,
  ): Promise<ImageResponseJson[]> {
    await this.albumService.isAlbumOfUser(user_id, album_id);
    for (const id_image of request.idImage) {
      if (await this.imageAlbumRepository.checkImageInAlbum(album_id, id_image)) {
        throw new Exception(AlbumError.DUPLICATE_IMAGE);
      }
      try {
        await this.imageAlbumRepository.addImageToAlbum(id_image, album_id);
      } catch (error) {
        throw new Exception(AlbumError.IMAGE_NOT_EXITS);
      }
    }
    return this.getAllImagesInAlbum(user_id, album_id);
  }

  public async removeImageFromAlbum(
    user_id: number,
    album_id: number,
    image_album_request: ImageAlbumRequest,
  ): Promise<void> {
    await this.albumService.isAlbumOfUser(user_id, album_id);
    for (const image_id of image_album_request.idImage) {
      await this.imageAlbumRepository.removeImageFromAlbum(album_id, image_id);
    }
  }

  public async getAllImagesInAlbum(
    user_id: number,
    album_id: number,
    is_guest: boolean = false,
  ): Promise<ImageResponseJson[]> {
    if (!is_guest) {
      await this.albumService.isAlbumOfUser(user_id, album_id);
    }

    const images = await this.imageAlbumRepository.getAllImageInAlbum(album_id);

    return images.map(({ image, like }) => {
      return new ImageResponse(image, null, like).toJson();
    });
  }
}
