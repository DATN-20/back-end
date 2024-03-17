import { DashboardImage } from './DashboardImage';

export class DashboardResponse {
  totalCount: number;
  data: DashboardImage[];

  constructor(total_count: number, data: DashboardImage[]) {
    this.totalCount = total_count;
    this.data = data;
  }
}
