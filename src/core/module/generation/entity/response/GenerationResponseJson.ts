import { GenerationStatus } from '@core/common/enum/GenerationStatus';

export interface GenerationResponseJson {
  id: string;
  status: GenerationStatus;
}
