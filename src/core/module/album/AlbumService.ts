import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AlbumRepository } from './AlbumRepository';
import { Album, NewAlbum } from './entity/Album';
import { AlbumError } from '@core/common/resource/error/AlbumError';
import { AlbumResponse } from './entity/response/AlbumResponse';
import { UserRepository } from '../user/UserRepository';
import { EditAlbumReq } from './entity/request/EditAlbumReq';
import { Exception } from '@core/common/exception/Exception';
import { ImageAlbumService } from '../images-album/ImageAlbumService';
import { AlbumWithImageResponse } from './entity/response/AlbumWithImageResponse';

@Injectable()
export class AlbumService {
  public constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ImageAlbumService))
    private readonly imageAlbumService: ImageAlbumService,
  ) {}
  async handleCreateNewAlbum(user_id: number, name: string) {
    const new_album: NewAlbum = {
      name: name,
      userId: user_id,
    };
    const create_album = await this.albumRepository.create(new_album);
    const album = await this.albumRepository.getById(create_album.id);

    const albumRes = await this.albumToAlbumResponse(album);

    return albumRes.toJson();
  }

  async handleDeleteAlbums(user_id: number, album_ids: number[]) {
    for (let i = 0; i < album_ids.length; i++) {
      this.handleDeleteAlbum(user_id, album_ids[i]);
    }
  }

  async handleDeleteAlbum(user_id: number, album_id: number): Promise<void> {
    if (await this.isAlbumOfUser(user_id, album_id)) {
      await this.albumRepository.deleteById(album_id);
    }
  }

  async handleEditAlbum(user_id: number, album_id: number, edit_album_req: EditAlbumReq) {
    if (!edit_album_req || Object.keys(edit_album_req).length === 0) {
      throw new Exception(AlbumError.BAD_EDIT_REQUEST);
    }
    if (await this.isAlbumOfUser(user_id, album_id)) {
      const albumEdited = await this.albumRepository.update(album_id, edit_album_req);

      return (await this.albumToAlbumResponse(albumEdited)).toJson();
    }
  }

  async handleViewAlbums(user_id: number) {
    const albums: Album[] = await this.albumRepository.getByUserId(user_id);
    const albumResponses = [];
    for (let i = 0; i < albums.length; i++) {
      albumResponses.push((await this.albumToAlbumResponse(albums[i])).toJson());
    }

    return albumResponses;
  }

  async isAlbumOfUser(user_id: number, album_id: number) {
    const album = await this.albumRepository.getById(album_id);
    if (!album) {
      throw new Exception(AlbumError.ALBUM_NOT_EXIST);
    }
    if (album.userId != user_id) {
      throw new Exception(AlbumError.NOT_OWNER_OF_ALBUM);
    }
    return true;
  }

  private async albumToAlbumResponse(album: Album) {
    const user = await this.userRepository.getById(album.userId);
    //Get album Image
    const responseAlbum = new AlbumResponse(album, user);

    return responseAlbum;
  }
  async getFullInfo(user_id: number, is_guest: boolean): Promise<AlbumWithImageResponse[]> {
    const albums = await this.albumRepository.getByUserId(user_id);
    const albumResponses = [];
    for (let i = 0; i < albums.length; i++) {
      const album = albums[i];

      let allImages;
      if (is_guest) {
        allImages = await this.imageAlbumService.getAllImagesInAlbumGuest(album.id);
      } else {
        allImages = await this.imageAlbumService.getAllImagesInAlbum(user_id, album.id);
      }

      const responseAlbum = new AlbumWithImageResponse(album, allImages);
      albumResponses.push(responseAlbum);
    }

    return albumResponses;
  }
}
