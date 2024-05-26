import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Image, NewImage } from './entity/Image';
import { images } from '@infrastructure/orm/schema';
import { and, count, desc, eq, like, or, sql } from 'drizzle-orm';
import { ImageType } from '@core/common/enum/ImageType';
import { ImageFilter } from './entity/filter/ImageFilter';

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

  async getByUserId(
    user_id: number,
    visibility: boolean = true,
    is_ignore_visibility: boolean = false,
  ): Promise<Image[]> {
    if (is_ignore_visibility) {
      return this.database.query.images.findMany({
        where: (image, { eq }) => eq(image.userId, user_id),
      });
    }

    return this.database.query.images.findMany({
      where: (image, { eq, and }) =>
        and(eq(image.userId, user_id), eq(image.visibility, visibility)),
    });
  }

  async getByUserIdAndImageTypes(user_id: number, types: ImageType[]): Promise<Image[]> {
    return this.database.query.images.findMany({
      where: (image, { eq, and, inArray }) =>
        and(eq(image.userId, user_id), inArray(images.type, types)),
      orderBy: desc(images.createdAt),
    });
  }

  async getImagesByGenerationIdOfUser(user_id: number, generation_id: string): Promise<Image[]> {
    return this.database.query.images.findMany({
      where: and(eq(images.userId, user_id), eq(images.generateId, generation_id)),
      orderBy: desc(images.createdAt),
    });
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
          or(
            sql`MATCH (${images.prompt}) AGAINST (${search_data} IN NATURAL LANGUAGE MODE)`,
            like(images.prompt, `%${search_data}%`),
          ),
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

  async countTotalRecordByUserId(user_id: number, visibility: boolean): Promise<number> {
    const result = await this.database
      .select({ count: count() })
      .from(images)
      .where(and(eq(images.userId, user_id), eq(images.visibility, visibility)));

    return result[0].count;
  }

  async updateVisibilityById(image_id: number, visibility: boolean): Promise<void> {
    await this.database.update(images).set({ visibility }).where(eq(images.id, image_id));
  }

  async getByUserIdWithPaginition(
    user_id: number,
    visibility: boolean,
    pagination: QueryPagination,
  ): Promise<Image[]> {
    return this.database.query.images.findMany({
      where: (image, { eq, and }) =>
        and(eq(image.userId, user_id), eq(image.visibility, visibility)),
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
    });
  }

  async countGeneratedImages(date: Date, filter: ImageFilter): Promise<number> {
    const result = await this.database
      .select({
        total: sql<number>`count(*) as count`.mapWith(Number),
      })
      .from(images)
      .where(
        and(
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
          sql`DAY(${images.createdAt}) = ${date.getDate()} and MONTH(${images.createdAt}) = ${
            date.getMonth() + 1
          } and YEAR(${images.createdAt}) = ${date.getFullYear()}`,
        ),
      )
      .groupBy(sql`DATE(${images.createdAt})`)
      .orderBy(sql`DATE(${images.createdAt})`);

    if (result.length === 0) {
      return 0;
    }
    return result[0]?.total;
  }
}
