import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_interaction } from '@infrastructure/orm/schema';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DashboardResponse } from './entity/response/DashboardResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { Image } from '../image/entity/Image';
import { VisibilityType } from '@core/common/enum/VisibilityType';

@Injectable()
export class DashboardImageRepository extends BaseRepository {
  async getTotalCountInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
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
        ),
      );

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
    limit: number;
    offset: number;
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
        ),
      )
      .orderBy(desc(sql`count(${images.id})`))
      .limit(data.limit)
      .offset(data.offset);

    return await main_query;
  }

  async getTopInteraction(
    type: InteractionType,
    limit: number,
    offset: number,
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
      .where(eq(images.visibility, true))
      .groupBy(sql`${images.id}`)
      .orderBy(desc(sql`IFNULL(count(${images_interaction.imageId}),0)`))
      .limit(limit)
      .offset(offset);

    return await main_query;
  }

  async getLatestImage(limit: number, offset: number): Promise<{ image: Image; count: number }[]> {
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
      .where(eq(images.visibility, true))
      .groupBy(sql`${images.id}`)
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);

    return await main_query;
  }

  async getTotalImage(): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images)
      .where(eq(images.visibility, true))
      .orderBy(asc(sql`RAND()`));

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getRandomImage(limit: number, offset: number): Promise<{ image: Image; count: number }[]> {
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
      .where(eq(images.visibility, true))
      .groupBy(sql`${images.id}`)
      .orderBy(asc(sql`RAND()`))
      .limit(limit)
      .offset(offset);

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
