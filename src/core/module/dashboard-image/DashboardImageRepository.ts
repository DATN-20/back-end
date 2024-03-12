import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_interaction } from '@infrastructure/orm/schema';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardImageRepository extends BaseRepository {
  async getInteractionsWithinTimeRange(data: {
    from_date: Date;
    to_date: Date;
    type: InteractionType;
    limit: number;
    offset: number;
  }): Promise<any> {
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

    const main_query = this.database
      .select({
        image: images,
        [`${data.type}`]: sql<number>`count(${images.id})`.mapWith(Number),
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

    const [total_count_Result, main_query_result] = await Promise.all([
      total_count_query,
      main_query,
    ]);
    const total_count = total_count_Result[0]?.total || 0;
    return {
      total_count,
      data: main_query_result,
    };
  }
  async getTopInteraction(type: InteractionType, limit: number, offset: number): Promise<any> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, type)));

    const main_query = this.database
      .select({
        image: images,
        [`${type}`]: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, type)))
      .orderBy(desc(sql`count(${images.id})`))
      .limit(limit)
      .offset(offset);

    const [total_count_Result, main_query_result] = await Promise.all([
      total_count_query,
      main_query,
    ]);
    const total_count = total_count_Result[0]?.total || 0;
    return {
      total_count,
      data: main_query_result,
    };
  }
  async getLatestImage(limit: number, offset: number): Promise<any> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const main_query = this.database
      .select({
        image: images,
        like: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)))
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);

    const [total_count_Result, main_query_result] = await Promise.all([
      total_count_query,
      main_query,
    ]);
    const total_count = total_count_Result[0]?.total || 0;
    return {
      total_count,
      data: main_query_result,
    };
  }

  async getRandomImage(limit: number, offset: number): Promise<any> {
    const total_count_query = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const main_query = this.database
      .select({
        image: images,
        like: sql<number>`count(${images.id})`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)))
      .orderBy(asc(sql`RAND()`))
      .limit(limit)
      .offset(offset);

    const [total_count_Result, main_query_result] = await Promise.all([
      total_count_query,
      main_query,
    ]);
    const total_count = total_count_Result[0]?.total || 0;
    return {
      total_count,
      data: main_query_result,
    };
  }
}
