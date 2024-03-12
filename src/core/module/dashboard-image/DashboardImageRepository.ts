import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_interaction } from '@infrastructure/orm/schema';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DashboardResponse } from './entity/Response/DashboardResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { Image } from '../image/entity/Image';

@Injectable()
export class DashboardImageRepository extends BaseRepository {
  async getTotalCountInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
  }): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(
        and(
          eq(images_interaction.type, data.type),
          between(images_interaction.updatedAt, data.from_date, data.to_date),
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
        ),
      )
      .orderBy(desc(sql`count(${images.id})`))
      .limit(data.limit)
      .offset(data.offset);

    return await main_query;
  }

  async getTotalCountTopInteraction(type: InteractionType): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, type)));

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getTopInteraction(
    type: InteractionType,
    limit: number,
    offset: number,
  ): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, type)))
      .orderBy(desc(sql`count(${images.id})`))
      .limit(limit)
      .offset(offset);

    return await main_query;
  }

  async getTotalCountLatestImage(): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getLatestImage(limit: number, offset: number): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)))
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);

    return await main_query;
  }

  async getTotalCountRandomImage(): Promise<number> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const total_count_result = await total_count_query;
    return total_count_result[0]?.total || 0;
  }

  async getRandomImage(limit: number, offset: number): Promise<{ image: Image; count: number }[]> {
    const main_query = this.database
      .select({
        image: images,
        count: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)))
      .orderBy(asc(sql`RAND()`))
      .limit(limit)
      .offset(offset);

    return await main_query;
  }
}
