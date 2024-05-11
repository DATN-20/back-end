import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { UserRepository } from '../user/UserRepository';
import { Image } from '../image/entity/Image';
import { ImageResponseJson } from '../image/entity/response/ImageResponseJson';
import { ImageFilter } from '../image/entity/filter/ImageFilter';

@Injectable()
export class DashboardImageService {
  constructor(
    private readonly repository: DashboardImageRepository,
    private readonly userRepository: UserRepository,
  ) {}
  //   public async getImagesByType(
  //     type: DashboardImageType,
  //     user_id: number,
  //     pagination: QueryPagination,
  //     filter: ImageFilter,
  //   ): Promise<QueryPaginationResponse<ImageResponseJson>> {
  //     switch (type) {
  //       case DashboardImageType.TOPLIKED:
  //         return await this.getTopImageLiked(user_id, pagination, filter);
  //       case DashboardImageType.TRENDING:
  //         return await this.getTopImageByWeek(InteractionType.LIKE, user_id, pagination, filter);
  //       case DashboardImageType.LATEST:
  //         return await this.getLatestImage(user_id, pagination, filter);
  //       default:
  //         return await this.getRandomImage(user_id, pagination, filter);
  //     }
  //   }

  //   async getTopImageByWeek(
  //     type: InteractionType,
  //     user_id: number,
  //     pagination: QueryPagination,
  //     filter: ImageFilter,
  //   ): Promise<QueryPaginationResponse<ImageResponseJson>> {
  //     const from_date = new Date();
  //     const to_date = new Date();
  //     to_date.setDate(to_date.getDate() + 1);
  //     from_date.setDate(to_date.getDate() - 8);

  //     // const total_count = await this.repository.getTotalCountInteractionsWithinTimeRange({
  //     //   from_date,
  //     //   to_date,
  //     //   type,
  //     //   filter,
  //     // });

  //     // const main_query_result = await this.repository.getInteractionsWithinTimeRange({
  //     //   from_date,
  //     //   to_date,
  //     //   type,
  //     //   pagination,
  //     //   filter,
  //     // });

  //     const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

  //     return {
  //       page: pagination.page,
  //       limit: pagination.limit,
  //       total: total_count,
  //       data: result,
  //     };
  //   }

  //   async getTopImageLiked(
  //     user_id: number,
  //     pagination: QueryPagination,
  //     filter: ImageFilter,
  //   ): Promise<QueryPaginationResponse<ImageResponseJson>> {
  //     const total_count = await this.repository.getTotalImage(filter);
  //     const main_query_result = await this.repository.getTopInteraction(
  //       InteractionType.LIKE,
  //       pagination,
  //       filter,
  //     );

  //     const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

  //     return {
  //       page: pagination.page,
  //       limit: pagination.limit,
  //       total: total_count,
  //       data: result,
  //     };
  //   }

  //   async getLatestImage(
  //     user_id: number,
  //     pagination: QueryPagination,
  //     filter: ImageFilter,
  //   ): Promise<QueryPaginationResponse<ImageResponseJson>> {
  //     const total_count = await this.repository.getTotalImage(filter);
  //     const main_query_result = await this.repository.getLatestImage(pagination, filter);

  //     const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

  //     return {
  //       page: pagination.page,
  //       limit: pagination.limit,
  //       total: total_count,
  //       data: result,
  //     };
  //   }
  //   async getRandomImage(
  //     user_id: number,
  //     pagination: QueryPagination,
  //     filter: ImageFilter,
  //   ): Promise<QueryPaginationResponse<ImageResponseJson>> {
  //     console.log('filter', filter);
  //     console.log('pagination', pagination);
  //     const total_count = await this.repository.getTotalImage(filter);
  //     const main_query_result = await this.repository.getRandomImage(pagination, filter);

  //     const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

  //     return {
  //       page: pagination.page,
  //       limit: pagination.limit,
  //       total: total_count,
  //       data: result,
  //     };
  //   }

  //   private async mainQueryResultToDashboardResponse(
  //     images_with_count: { image: Image; count: number }[],
  //     user_id: number,
  //   ): Promise<ImageResponseJson[]> {
  //     const result: ImageResponseJson[] = [];
  //     for (const { image, count } of images_with_count) {
  //       const owner = await this.userRepository.getById(image.userId);
  //       const is_liked = !!(await this.repository.getByImageIdAndUserId(user_id, image.id));

  //       result.push(new ImageResponse(image, owner, count, is_liked).toJson());
  //     }

  //     return result;
  //   }
}
