import { RemoveBackgroundReq } from '@core/module/generate-image/entity/request/RemoveBackgroundReq';

export interface IComfyUIFeatureService {
  removeBackground(req_data: RemoveBackgroundReq): Promise<string>;
}
