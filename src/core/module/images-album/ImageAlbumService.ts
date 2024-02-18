import { Injectable } from '@nestjs/common';
import { ImageAlbumRepository } from './ImageAlbumRepository';

@Injectable()
export class ImageAlbumService {
  public constructor(
    private readonly imageAlbumRepository: ImageAlbumRepository,
  ) {}
}
