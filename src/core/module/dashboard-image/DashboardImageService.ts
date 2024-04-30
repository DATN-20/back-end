import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';
import { DashboardResponse } from './entity/response/DashboardResponse';
import { ImageResponse } from '../image/entity/response/ImageResponse';
import { UserRepository } from '../user/UserRepository';
import { Image } from '../image/entity/Image';

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
  ) {
    const offset = (page - 1) * limit;
    switch (type) {
      case DashboardImageType.TOPLIKED:
        return await this.getTopImageLiked(limit, offset, user_id);
      case DashboardImageType.TRENDING:
        return await this.getTopImageByWeek(InteractionType.LIKE, limit, offset, user_id);
      case DashboardImageType.LATEST:
        return await this.getLatestImage(limit, offset, user_id);
      default:
        return await this.getRandomImage(limit, offset, user_id);
    }
  }

  async getTopImageByWeek(type: InteractionType, limit: number, offset: number, user_id: number) {
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

    return new DashboardResponse(total_count, result).toJson();
  }
  async getTopImageLiked(limit: number, offset: number, user_id: number) {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getTopInteraction(
      InteractionType.LIKE,
      limit,
      offset,
    );

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);
    return new DashboardResponse(total_count, result).toJson();
  }
  async getLatestImage(limit: number, offset: number, user_id: number) {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getLatestImage(limit, offset);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result).toJson();
  }
  async getRandomImage(limit: number, offset: number, user_id: number) {
    const total_count = await this.repository.getTotalImage();
    const main_query_result = await this.repository.getRandomImage(limit, offset);

    const result = await this.mainQueryResultToDashboardResponse(main_query_result, user_id);

    return new DashboardResponse(total_count, result).toJson();
  }

  private async mainQueryResultToDashboardResponse(
    images_with_count: { image: Image; count: number }[],
    user_id: number,
  ): Promise<ImageResponse[]> {
    let result: ImageResponse[] = [];
    for (let { image, count } of images_with_count) {
      const owner = await this.userRepository.getById(image.userId);
      const is_liked = !!(await this.repository.getByImageIdAndUserId(user_id, image.id));

      result.push(new ImageResponse(image, owner, count, is_liked));
    }

    return result;
  }
}
