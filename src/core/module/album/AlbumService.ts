import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './AlbumRepository';
import { NewAlbum } from './entity/Album';

@Injectable()
export class AlbumService {
  public constructor(private readonly albumRepository: AlbumRepository) {}
  async handleCreateNewAlbum(user_id: number, name: string) {
    const new_album: NewAlbum = {
      name: name,
      userId: user_id,
    };
    const create_album = await this.albumRepository.create(new_album);
  }

  async handleDeleteAlbum() {}

  async handleEditAlbum() {}

  async handleViewAlbums() {}
}
