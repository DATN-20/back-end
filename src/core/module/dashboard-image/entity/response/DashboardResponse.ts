import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';

export class DashboardResponse {
  totalCount: number;
  data: ImageResponse[];

  constructor(total_count: number, data: ImageResponse[]) {
    this.totalCount = total_count;
    this.data = data;
  }

  toJson() {
    return {
      total_count: this.totalCount,
      data: this.data,
    };
  }
}
