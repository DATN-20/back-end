import { ImageData } from './ImageData';

export class DashboardResponse {
  total_count: number;
  data: ImageData[];

  constructor(total_count: number, data: ImageData[]) {
    this.total_count = total_count;
    this.data = data;
  }
}
