import { Injectable } from '@nestjs/common';
import { DashboardImageRepository } from './DashboardImageRepository';
import { InteractionType } from '@core/common/enum/InteractionType';
import { DashboardImageType } from '@core/common/enum/DashboardImageType';

@Injectable()
export class DashboardImageService {
  constructor(private readonly repository: DashboardImageRepository) {}

  public async getImagesByType(
    type: DashboardImageType,
    limit: number,
    page: number,
  ): Promise<void> {
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

  public async getTopImageByWeek(
    type: InteractionType,
    limit: number,
    offset: number,
  ): Promise<void> {
    const fromDate = new Date();
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    fromDate.setDate(toDate.getDate() - 8);
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      type: type,
      limit: limit,
      offset: offset,
    };
    return await this.repository.getInteractionsWithinTimeRange(data);
  }
  async getTopImageLiked(limit: number, offset: number): Promise<any> {
    return await this.repository.getTopInteraction(InteractionType.LIKE, limit, offset);
  }
  async getLatestImage(limit: number, offset: number): Promise<any> {
    return await this.repository.getLatestImage(limit, offset);
  }
  async getRandomImage(limit: number, offset: number): Promise<any> {
    return await this.repository.getRandomImage(limit, offset);
  }
}
