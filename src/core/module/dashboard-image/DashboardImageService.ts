import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { DashboardResponse } from './entity/response/DashboardResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { UserRepository } from '../user/UserRepository';

@Injectable()
export class DashboardImageService {
  constructor(
    private readonly repository: DashboardImageRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async getImagesByType(
    type: DashboardImageType,
    limit: number,
    page: number,
    user_id: number,
  ): Promise<DashboardResponse> {
    const offset = (page - 1) * limit;
    switch (type) {
      case DashboardImageType.TOPLIKED:
        return await this.getTopImageLiked(limit, offset, user_id);
      case DashboardImageType.TRENDING:
        return await this.getTopImageByWeek(InteractionType.LIKE, limit, offset, user_id);
      case DashboardImageType.LATEST:
        return await this.getLatestImage(limit, offset, user_id);
      case DashboardImageType.RANDOM:
        return await this.getRandomImage(limit, offset, user_id);
    }
  }

  async getTopImageByWeek(
    type: InteractionType,
    limit: number,
    offset: number,
    user_id: number,
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

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result);
  }
  async getTopImageLiked(
    limit: number,
    offset: number,
    user_id: number,
  ): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountTopInteraction(InteractionType.LIKE);
    const main_query_result = await this.repository.getTopInteraction(
      InteractionType.LIKE,
      limit,
      offset,
    );

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result);
  }
  async getLatestImage(limit: number, offset: number, user_id: number): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountLatestImage();
    const main_query_result = await this.repository.getLatestImage(limit, offset);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result);
  }
  async getRandomImage(limit: number, offset: number, user_id: number): Promise<DashboardResponse> {
    const total_count = await this.repository.getTotalCountRandomImage();
    const main_query_result = await this.repository.getRandomImage(limit, offset);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result);
  }

  private async mainQueryResultToDashboardResponse(
    main_query_result,
    user_id,
  ): Promise<ImageResponse[]> {
    const result = main_query_result.map(async ({ image, count }) => {
      const owner = await this.userRepository.getById(image.user_id);
      const isLiked = (await this.repository.getByImageIdAndUserId(image.id, user_id))
        ? true
        : false;

      return new ImageResponse(image, owner, count, isLiked);
    });

    return result;
  }
}
