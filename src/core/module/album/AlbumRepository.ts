import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Album, NewAlbum } from './entity/Album';
import { albums } from '@infrastructure/orm/schema';
import { eq } from 'drizzle-orm';

export class AlbumRepository extends BaseRepository {
  async create(new_album: NewAlbum): Promise<Album> {
    const result = await this.database.insert(albums).values(new_album);

    return await this.getById(result[0].insertId);
  }

  async getById(id: number): Promise<Album> {
    return await this.database.query.albums.findFirst({
      where: (albums, { eq }) => eq(albums.id, id),
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.database.delete(albums).where(eq(albums.id, id));
  }

  async getByUserId(user_id: number): Promise<Album[]> {
    return this.database.query.albums.findMany({
      where: (album, { eq }) => eq(album.userId, user_id),
    });
  }

  async update(id: number, edited_data: Partial<NewAlbum>) {
    edited_data.updatedAt = new Date();
    await this.database
      .update(albums)
      .set({
        name: edited_data.name,
        updatedAt: new Date(),
      })
      .where(eq(albums.id, id));

    return await this.getById(id);
  }
}
