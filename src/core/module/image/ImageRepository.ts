import { BaseRepository } from '@core/common/repository/BaseRepository';
import { Image, NewImage } from './entity/Image';
import { images } from '@infrastructure/orm/schema';
import { and, count, eq, max, sql } from 'drizzle-orm';
import { ImageType } from '@core/common/enum/ImageType';
import { ImageFilter } from './entity/filter/ImageFilter';
import { DateQueryScript } from '../image-statistics/entity/type/DateQueryScript';

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
      where: (image, { eq }) => eq(image.userId, user_id) && eq(image.visibility, visibility),
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
      where: (image, { eq }) => eq(image.userId, user_id) && eq(image.visibility, visibility),
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
    });
  }

  async countGeneratedImages(
    start_date: Date,
    end_date: Date,
    filter: ImageFilter,
    type: string,
  ): Promise<any> {
    const query = new DateQueryScript(type, images, start_date, end_date);
    const result = await this.database
      .select({
        date: query.getDay,
        total: sql<number>`count(*) as count`.mapWith(Number),
      })
      .from(images)
      .where(
        and(
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
          query.comparesLessDay,
          query.compareGreaterDay,
        ),
      )
      .groupBy(and(query.getDay))
      .orderBy(query.getDay);

    return result;
  }
}
