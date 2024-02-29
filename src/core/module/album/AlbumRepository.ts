import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Album, NewAlbum } from './entity/Album';
import { albums } from '@infrastructure/orm/schema';
import { eq } from 'drizzle-orm';

export class AlbumRepository extends BaseRepository {
  async create(newAlbum: NewAlbum): Promise<Album> {
    const result = await this.database.insert(albums).values(newAlbum);

    return await this.getById(result[0].insertId);
  }

  async getById(id: number): Promise<Album> {
    return this.database.query.albums.findFirst({
      where: (albums, { eq }) => eq(albums.id, id),
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.database.delete(albums).where(eq(albums.id, id));
  }

  async getByUserId(userId: number): Promise<Album[]> {
    return this.database.query.albums.findMany({
      where: (album, { eq }) => eq(album.userId, userId),
    });
  }
}
