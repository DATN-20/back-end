import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Image, NewImage } from './entity/Image';
import { images } from '@infrastructure/orm/schema';
import { eq, max } from 'drizzle-orm';
import { ImageType } from '@core/common/enum/ImageType';

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

  async getByUserIdAndImageTypes(user_id: number, types: ImageType[]): Promise<Image[]> {
    return this.database.query.images.findMany({
      where: (image, { eq, inArray }) => eq(image.userId, user_id) && inArray(images.type, types),
    });
  }

  async getUserMaxGenerateID(user_id: number): Promise<number> {
    var result = 0;
    const query_result = await this.database
      .select({ value: max(images.generateId) })
      .from(images)
      .where(eq(images.userId, user_id));

    if (query_result.length > 0) {
      result = query_result[0].value;
    }

    return result;
  }

  async updateRemoveBackgroundImageById(image_id: number, url: string): Promise<Image> {
    await this.database
      .update(images)
      .set({ removeBackground: url })
      .where(eq(images.id, image_id));

    return this.getById(image_id);
  }

  async updateUpscaleImageById(image_id: number, url: string): Promise<Image> {
    await this.database.update(images).set({ upscale: url }).where(eq(images.id, image_id));

    return this.getById(image_id);
  }
}
