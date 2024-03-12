import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { DashboardResponse } from './entity/responses/DashboardResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';

@Injectable()
export class DashboardImageService {
  constructor(private readonly repository: DashboardImageRepository) {}
  public async getImagesByType(
    type: DashboardImageType,
    limit: number,
    page: number,
  ): Promise<DashboardResponse> {
    const offset = (page - 1) * limit;
    switch (type) {
      case DashboardImageType.TOPLIKED:
        return await this.getTopImageLiked(limit, offset);
      case DashboardImageType.TRENDING:
        return await this.getTopImageByWeek(InteractionType.LIKE, limit, offset);
      case DashboardImageType.LATEST:
        return await this.getLatestImage(limit, offset);
      case DashboardImageType.RANDOM:
        return await this.getRandomImage(limit, offset);
    }
  }

  async getTopImageByWeek(
    type: InteractionType,
    limit: number,
    offset: number,
  ): Promise<DashboardResponse> {
    const from_date = new Date();
    const to_date = new Date();
    to_date.setDate(to_date.getDate() + 1);
    from_date.setDate(to_date.getDate() - 8);
    const data = {
      from_date: from_date,
      to_date: to_date,
      type: type,
      limit: limit,
      offset: offset,
    };
    const total_count = await this.repository.getTotalCountInteractionsWithinTimeRange(data);
    const main_query_result = await this.repository.getInteractionsWithinTimeRange(data);

    const result = main_query_result.map(({ image, count }) => ({
      image: ImageResponse.convertFromImage(image),
      like: count,
    }));

    return new DashboardResponse(total_count, result);
  }
  async getTopImageLiked(limit: number, offset: number): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountTopInteraction(InteractionType.LIKE);
    const main_query_result = await this.repository.getTopInteraction(
      InteractionType.LIKE,
      limit,
      offset,
    );

    const result = main_query_result.map(({ image, count }) => ({
      image: ImageResponse.convertFromImage(image),
      like: count,
    }));

    return new DashboardResponse(total_count, result);
  }
  async getLatestImage(limit: number, offset: number): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountLatestImage();
    const main_query_result = await this.repository.getLatestImage(limit, offset);

    const result = main_query_result.map(({ image, count }) => ({
      image: ImageResponse.convertFromImage(image),
      like: count,
    }));

    return new DashboardResponse(total_count, result);
  }
  async getRandomImage(limit: number, offset: number): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountRandomImage();
    const main_query_result = await this.repository.getRandomImage(limit, offset);

    const result = main_query_result.map(({ image, count }) => ({
      image: ImageResponse.convertFromImage(image),
      like: count,
    }));

    return new DashboardResponse(total_count, result);
  }
}
