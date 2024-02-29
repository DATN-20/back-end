import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './AlbumRepository';

@Injectable()
export class AlbumService {
  public constructor(private readonly albumRepository: AlbumRepository) {}
  async handleCreateNewAlbum() {}

  async handleDeleteAlbum() {}

  async handleEditAlbum() {}

  async handleViewAlbums() {}
}
