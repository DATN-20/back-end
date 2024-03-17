import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';
import { DashboardImage } from './DashboardImage';

export class DashboardResponse {
  totalCount: number;
  data: ImageResponse[];

  constructor(total_count: number, data: ImageResponse[]) {
    this.totalCount = total_count;
    this.data = data;
  }

  private dataToJson() {
    return this.data.map(image => image.toJson());
  }

  toJson() {
    return {
      total_count: this.totalCount,
      data: this.dataToJson(),
    };
  }
}
