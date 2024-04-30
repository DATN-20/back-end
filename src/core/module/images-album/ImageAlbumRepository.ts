import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_album, images_interaction } from '@infrastructure/orm/schema';
import { ImageAlbum } from './entity/ImageAlbum';
import { and, eq, sql } from 'drizzle-orm';
import { Image } from '../image/entity/Image';
import { getTableColumns } from 'drizzle-orm';
import { ImageAlbumDTO } from './entity/dto/ImageAlbumDTO';

export class ImageAlbumRepository extends BaseRepository {
  public async addImageToAlbum(id_image: number, id_album: number): Promise<void> {
    await this.database.insert(images_album).values({
      albumId: id_album,
      imageId: id_image,
    });
  }
  public async getAllImageInAlbum(album_id: number): Promise<ImageAlbumDTO[]> {
    const result = await this.database
      .select({
        image: images,
        like: sql<number>`IFNULL(count(${images_interaction.imageId}),0)`.mapWith(Number),
      })
      .from(images_album)
      .innerJoin(images, eq(images.id, images_album.imageId))
      .leftJoin(images_interaction, eq(images_interaction.imageId, images.id))
      .where(eq(images_album.albumId, album_id))
      .groupBy(images.id);
    return result;
  }
  public async removeImageFromAlbum(id_album: number, id_image: number): Promise<void> {
    await this.database
      .delete(images_album)
      .where(and(eq(images_album.albumId, id_album), eq(images_album.imageId, id_image)));
  }
  public async checkImageInAlbum(id_album: number, id_image: number): Promise<boolean> {
    const result = await this.database
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(images_album)
      .where(and(eq(images_album.albumId, id_album), eq(images_album.imageId, id_image)));

    return result[0].count > 0;
  }
}
