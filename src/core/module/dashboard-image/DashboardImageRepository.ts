import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images, images_interaction } from '@infrastructure/orm/schema';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardImageRepository extends BaseRepository {
  async getInteractionsWithinTimeRange(data: {
    fromDate: Date;
    toDate: Date;
    type: InteractionType;
    limit: number;
    offset: number;
  }): Promise<any> {
    const totalCountQuery = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(
        and(
          eq(images_interaction.type, data.type),
          between(images_interaction.updatedAt, data.fromDate, data.toDate),
        ),
      );

    const mainQuery = this.database
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
          between(images_interaction.updatedAt, data.fromDate, data.toDate),
        ),
      )
      .orderBy(desc(sql`count(${images.id})`))
      .limit(data.limit)
      .offset(data.offset);

    const [totalCountResult, mainQueryResult] = await Promise.all([totalCountQuery, mainQuery]);
    const totalCount = totalCountResult[0]?.total || 0;
    return {
      totalCount,
      data: mainQueryResult,
    };
  }
  async getTopInteraction(type: InteractionType, limit: number, offset: number): Promise<any> {
    const totalCountQuery = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, type)));

    const mainQuery = this.database
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

    const [totalCountResult, mainQueryResult] = await Promise.all([totalCountQuery, mainQuery]);
    const totalCount = totalCountResult[0]?.total || 0;
    return {
      totalCount,
      data: mainQueryResult,
    };
  }
  async getLatestImage(limit: number, offset: number): Promise<any> {
    const totalCountQuery = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const mainQuery = this.database
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

    const [totalCountResult, mainQueryResult] = await Promise.all([totalCountQuery, mainQuery]);
    const totalCount = totalCountResult[0]?.total || 0;
    return {
      totalCount,
      data: mainQueryResult,
    };
  }

  async getRandomImage(limit: number, offset: number): Promise<any> {
    const totalCountQuery = this.database
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(images_interaction)
      .innerJoin(images, eq(images.id, images_interaction.imageId))
      .groupBy(sql`${images_interaction.imageId}`)
      .where(and(eq(images_interaction.type, InteractionType.LIKE)));

    const mainQuery = this.database
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

    const [totalCountResult, mainQueryResult] = await Promise.all([totalCountQuery, mainQuery]);
    const totalCount = totalCountResult[0]?.total || 0;
    return {
      totalCount,
      data: mainQueryResult,
    };
  }
}
