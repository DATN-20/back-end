import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_interaction } from '@infrastructure/orm/schema';
import { and, asc, between, desc, eq, ilike, like, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { Image } from '../image/entity/Image';
import { ImageFilter, ImageFilterType } from '../image/entity/filter/ImageFilter';
import { ImageType } from '@core/common/enum/ImageType';

@Injectable()
export class DashboardImageRepository extends BaseRepository {
  async getTotalCountInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
    filter: ImageFilter;
  }): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(DISTINCT ${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .where(
        and(
          eq(images_interaction.type, data.type),
          between(images_interaction.updatedAt, data.from_date, data.to_date),
          eq(images.visibility, true),
          data.filter.aiName != 'ALL' ? eq(images.aiName, data.filter.aiName) : sql`1=1`,
          data.filter.imageType != 'ALL'
            ? eq(images.type, ImageType[data.filter.imageType])
            : sql`1=1`,
          data.filter.style != 'ALL' ? eq(images.style, data.filter.style) : sql`1=1`,
        ),
      );

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
    pagination: QueryPagination;
    filter: ImageFilter;
  }): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(
        and(
          eq(images_interaction.type, data.type),
          between(images_interaction.updatedAt, data.from_date, data.to_date),
          eq(images.visibility, true),
          data.filter.aiName != 'ALL' ? eq(images.aiName, data.filter.aiName) : sql`1=1`,
          data.filter.imageType != 'ALL'
            ? eq(images.type, ImageType[data.filter.imageType])
            : sql`1=1`,
          data.filter.style != 'ALL' ? eq(images.style, data.filter.style) : sql`1=1`,
        ),
      )
      .orderBy(desc(sql`count(${images.id})`))
      .limit(data.pagination.limit)
      .offset((data.pagination.page - 1) * data.pagination.limit);

    return await main_query;
  }

  async getTopInteraction(
    type: InteractionType,
    pagination: QueryPagination,
    filter: ImageFilter,
  ): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`IFNULL(count(${images_interaction.imageId}),0)`.mapWith(Number),
      })
      .from(images)
      .leftJoin(
        images_interaction,
        and(eq(images.id, images_interaction.imageId), eq(images_interaction.type, type)),
      )
      .where(
        and(
          eq(images.visibility, true),
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
        ),
      )
      .groupBy(sql`${images.id}`)
      .orderBy(desc(sql`IFNULL(count(${images_interaction.imageId}),0)`))
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);

    return await main_query;
  }

  async getLatestImage(
    pagination: QueryPagination,
    filter: ImageFilter,
  ): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`IFNULL(count(${images_interaction.imageId}),0)`.mapWith(Number),
      })
      .from(images)
      .leftJoin(
        images_interaction,
        and(
          eq(images.id, images_interaction.imageId),
          eq(images_interaction.type, InteractionType.LIKE),
        ),
      )
      .where(
        and(
          eq(images.visibility, true),
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
        ),
      )
      .groupBy(sql`${images.id}`)
      .orderBy(desc(images.createdAt))
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);

    return await main_query;
  }

  async getTotalImage(filter: ImageFilter): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images)
      .where(
        and(
          eq(images.visibility, true),
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
        ),
      )
      .orderBy(asc(sql`RAND()`));

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getRandomImage(
    pagination: QueryPagination,
    filter: ImageFilter,
  ): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`IFNULL(count(${images_interaction.imageId}),0)`.mapWith(Number),
      })
      .from(images)
      .leftJoin(
        images_interaction,
        and(
          eq(images.id, images_interaction.imageId),
          eq(images_interaction.type, InteractionType.LIKE),
        ),
      )
      .where(
        and(
          eq(images.visibility, true),
          filter.aiName != 'ALL' ? eq(images.aiName, filter.aiName) : sql`1=1`,
          filter.imageType != 'ALL' ? eq(images.type, ImageType[filter.imageType]) : sql`1=1`,
          filter.style != 'ALL' ? eq(images.style, filter.style) : sql`1=1`,
        ),
      )
      .groupBy(sql`${images.id}`)
      .orderBy(asc(sql`RAND()`))
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);

    return await main_query;
  }

  async getByImageIdAndUserId(
    user_id: number,
    image_id: number,
    type: InteractionType = InteractionType.LIKE,
  ) {
    return this.database.query.images_interaction.findFirst({
      where: (image_interaction, { and, eq }) =>
        and(
          eq(image_interaction.imageId, image_id),
          eq(image_interaction.userId, user_id),
          eq(image_interaction.type, type),
        ),
    });
  }
}
