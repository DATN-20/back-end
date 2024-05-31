import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ImageAlbumRepository } from './ImageAlbumRepository';
import { ImageAlbumRequest } from './entity/request/ImageAlbumRequest';
import { AlbumError } from '@core/common/resource/error/AlbumError';
import { Exception } from '@core/common/exception/Exception';
import { AlbumService } from '../album/AlbumService';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { ImageResponseJson } from '../image/entity/response/ImageResponseJson';
import { ImageRepository } from '../image/ImageRepository';
import { ImageError } from '@core/common/resource/error/ImageError';

@Injectable()
export class ImageAlbumService {
  public constructor(
    private readonly imageAlbumRepository: ImageAlbumRepository,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    private readonly imageRepository: ImageRepository,
  ) {}

  public async addImageToAlbum(
    user_id: number,
    album_id: number,
    request: ImageAlbumRequest,
  ): Promise<ImageResponseJson[]> {
    await this.albumService.isAlbumOfUser(user_id, album_id);
    for (const image_id of request.imageIds) {
      const is_existed = await this.imageRepository.getById(image_id);
      const is_in_album = await this.imageAlbumRepository.checkImageInAlbum(album_id, image_id);

      if (!is_existed) {
        throw new Exception(ImageError.IMAGE_NOT_FOUND);
      }

      if (is_in_album) {
        throw new Exception(AlbumError.DUPLICATE_IMAGE);
      }
    }

    for (const image_id of request.imageIds) {
      await this.imageAlbumRepository.addImageToAlbum(image_id, album_id);
    }

    return this.getAllImagesInAlbum(user_id, album_id);
  }

  public async removeImageFromAlbum(
    user_id: number,
    album_id: number,
    image_album_request: ImageAlbumRequest,
  ): Promise<void> {
    await this.albumService.isAlbumOfUser(user_id, album_id);

    for (const image_id of image_album_request.imageIds) {
      const is_in_album = await this.imageAlbumRepository.checkImageInAlbum(album_id, image_id);

      if (!is_in_album) {
        throw new Exception(AlbumError.ALBUM_NOT_INCLUDE_IMAGE);
      }
    }

    for (const image_id of image_album_request.imageIds) {
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
