import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AlbumRepository } from './AlbumRepository';
import { Album, NewAlbum } from './entity/Album';
import { AlbumError } from '@core/common/resource/error/AlbumError';
import { AlbumResponse } from './entity/response/AlbumResponse';
import { UserRepository } from '../user/UserRepository';
import { EditAlbumReq } from './entity/request/EditAlbumReq';
import { Exception } from '@core/common/exception/Exception';
import { ImageAlbumService } from '../images-album/ImageAlbumService';
import { AlbumResponseJson } from './entity/response/AlbumResponseJson';
import { AlbumWithImagesResponseJson } from './entity/response/AlbumWithImagesResponseJson';

@Injectable()
export class AlbumService {
  public constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ImageAlbumService))
    private readonly imageAlbumService: ImageAlbumService,
  ) {}

  async handleCreateNewAlbum(user_id: number, name: string): Promise<AlbumResponseJson> {
    const new_album: NewAlbum = {
      name: name,
      userId: user_id,
    };

    const created_album = await this.albumRepository.create(new_album);

    return this.albumToAlbumResponseJson(created_album);
  }

  async handleDeleteAlbums(user_id: number, album_ids: number[]): Promise<void> {
    for (const album_id of album_ids) {
      await this.isAlbumOfUser(user_id, album_id);
    }

    for (const album_id of album_ids) {
      await this.albumRepository.deleteById(album_id);
    }
  }

  async handleDeleteAlbum(user_id: number, album_id: number): Promise<void> {
    await this.isAlbumOfUser(user_id, album_id);
    await this.albumRepository.deleteById(album_id);
  }

  async handleEditAlbum(
    user_id: number,
    album_id: number,
    edit_album_req: EditAlbumReq,
  ): Promise<AlbumResponseJson> {
    await this.isAlbumOfUser(user_id, album_id);
    const edited_album = await this.albumRepository.update(album_id, edit_album_req);

    return this.albumToAlbumResponseJson(edited_album);
  }

  async handleViewAlbums(user_id: number): Promise<AlbumResponseJson[]> {
    const albums = await this.albumRepository.getByUserId(user_id);
    return this.arrayAlbumsToAlbumResponseJson(albums);
  }

  async isAlbumOfUser(user_id: number, album_id: number): Promise<boolean> {
    const album = await this.albumRepository.getById(album_id);

    if (!album) {
      throw new Exception(AlbumError.ALBUM_NOT_EXIST);
    }

    if (album.userId !== user_id) {
      throw new Exception(AlbumError.NOT_OWNER_OF_ALBUM);
    }

    return true;
  }

  private async albumToAlbumResponseJson(album: Album): Promise<AlbumResponseJson> {
    const user = await this.userRepository.getById(album.userId);
    const response_album_json = new AlbumResponse(album, user);

    return response_album_json.toJson();
  }

  private async arrayAlbumsToAlbumResponseJson(albums: Album[]): Promise<AlbumResponseJson[]> {
    if (albums.length === 0) {
      return [];
    }

    const user = await this.userRepository.getById(albums[0].userId);

    return albums.map(album => {
      return new AlbumResponse(album, user).toJson();
    });
  }

  async handleGetFullInfo(
    user_id: number,
    is_guest: boolean = false,
  ): Promise<AlbumWithImagesResponseJson[]> {
    const albums = await this.albumRepository.getByUserId(user_id);
    const albums_with_images_response: AlbumWithImagesResponseJson[] = [];
    const albums_response = await this.arrayAlbumsToAlbumResponseJson(albums);

    for (let index = 0; index < albums.length; index++) {
      const images = await this.imageAlbumService.getAllImagesInAlbum(
        user_id,
        albums[index].id,
        is_guest,
      );

      albums_with_images_response.push({
        album: albums_response[index],
        images,
      });
    }

    return albums_with_images_response;
  }
}
