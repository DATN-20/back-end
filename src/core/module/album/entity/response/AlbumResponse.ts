import { Album } from '../Album';

export class AlbumResponse {
  private id: number;
  private name: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static convertFromAlbum(album: Album) {
    return new AlbumResponse(album.id, album.name, album.createdAt, album.updatedAt);
  }
}
