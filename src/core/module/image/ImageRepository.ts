import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Image, NewImage } from './entity/Image';
import { images } from '@infrastructure/orm/schema';
import { eq } from 'drizzle-orm';

export class ImageRepository extends BaseRepository {
  async create(newImage: NewImage): Promise<Image> {
    const result = await this.database.insert(images).values(newImage);

    return await this.getById(result[0].insertId);
  }

  async getById(id: number): Promise<Image> {
    return this.database.query.images.findFirst({
      where: (images, { eq }) => eq(images.id, id),
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.database.delete(images).where(eq(images.id, id));
  }

  async getByUserId(userId: number): Promise<Image[]> {
    return this.database.query.images.findMany({
      where: (image, { eq }) => eq(image.userId, userId),
    });
  }
}
