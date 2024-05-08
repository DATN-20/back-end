import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Image, NewImage } from './entity/Image';
import { images } from '@infrastructure/orm/schema';
import { and, count, eq, max, sql } from 'drizzle-orm';
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
    let result = 0;
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

  async searchByPrompt(search_data: string, pagination: QueryPagination): Promise<Image[]> {
    return this.database
      .select()
      .from(images)
      .where(
        and(
          sql`MATCH (${images.prompt}) AGAINST (${search_data} IN NATURAL LANGUAGE MODE)`,
          eq(images.visibility, true),
        ),
      )
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);
  }

  async countTotalRecordSeachByPrompt(search_data: string): Promise<number> {
    const result = await this.database
      .select({ count: count() })
      .from(images)
      .where(
        and(
          sql`MATCH (${images.prompt}) AGAINST (${search_data} IN NATURAL LANGUAGE MODE)`,
          eq(images.visibility, true),
        ),
      );

    return result[0].count;
  }
}
