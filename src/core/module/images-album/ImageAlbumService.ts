import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ImageAlbumRepository } from './ImageAlbumRepository';
import { ImageAlbumRequest } from './entity/request/ImageAlbumRequest';
import { AlbumMessage } from '@core/common/resource/message/AlbumMessage';
import { AlbumError } from '@core/common/resource/error/AlbumError';
import { Exception } from '@core/common/exception/Exception';
import { AlbumService } from '../album/AlbumService';

@Injectable()
export class ImageAlbumService {
  public constructor(
    private readonly imageAlbumRepository: ImageAlbumRepository,
    private readonly albumService: AlbumService,
  ) {}

  public async addImageToAlbum(user_id: number, album_id: number, request: ImageAlbumRequest) {
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
    return this.imageAlbumRepository.getAllImageInAlbum(album_id);
  }
  public async removeImageFromAlbum(
    user_id: number,
    album_id: number,
    image_album_request: ImageAlbumRequest,
  ) {
    await this.albumService.isAlbumOfUser(user_id, album_id);
    for (const image_id of image_album_request.idImage) {
      await this.imageAlbumRepository.removeImageFromAlbum(album_id, image_id);
    }
  }
  public async getAllImagesInAlbum(user_id: number, album_id: number) {
    await this.albumService.isAlbumOfUser(user_id, album_id);
    const result = await this.imageAlbumRepository.getAllImageInAlbum(album_id);
    return result;
  }
}
