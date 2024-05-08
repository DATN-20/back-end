import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { UserRepository } from '../user/UserRepository';
import { Image } from '../image/entity/Image';
import { ImageResponseJson } from '../image/entity/response/ImageResponseJson';

@Injectable()
export class DashboardImageService {
  constructor(
    private readonly repository: DashboardImageRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async getImagesByType(
    type: DashboardImageType,
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    switch (type) {
      case DashboardImageType.TOPLIKED:
        return await this.getTopImageLiked(user_id, pagination);
      case DashboardImageType.TRENDING:
        return await this.getTopImageByWeek(InteractionType.LIKE, user_id, pagination);
      case DashboardImageType.LATEST:
        return await this.getLatestImage(user_id, pagination);
      default:
        return await this.getRandomImage(user_id, pagination);
    }
  }

  async getTopImageByWeek(
    type: InteractionType,
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const from_date = new Date();
    const to_date = new Date();
    to_date.setDate(to_date.getDate() + 1);
    from_date.setDate(to_date.getDate() - 8);

    const total_count = await this.repository.getTotalCountInteractionsWithinTimeRange({
      from_date,
      to_date,
      type,
    });

    const main_query_result = await this.repository.getInteractionsWithinTimeRange({
      from_date,
      to_date,
      type,
      pagination,
    });

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: total_count,
      data: result,
    };
  }

  async getTopImageLiked(
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getTopInteraction(
      InteractionType.LIKE,
      pagination,
    );

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: total_count,
      data: result,
    };
  }

  async getLatestImage(
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getLatestImage(pagination);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: total_count,
      data: result,
    };
  }
  async getRandomImage(
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getRandomImage(pagination);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: total_count,
      data: result,
    };
  }

  private async mainQueryResultToDashboardResponse(
    images_with_count: { image: Image; count: number }[],
    user_id: number,
  ): Promise<ImageResponseJson[]> {
    const result: ImageResponseJson[] = [];
    for (const { image, count } of images_with_count) {
      const owner = await this.userRepository.getById(image.userId);
      const is_liked = !!(await this.repository.getByImageIdAndUserId(user_id, image.id));

      result.push(new ImageResponse(image, owner, count, is_liked).toJson());
    }

    return result;
  }
}
