import { GenerationStatus } from '@core/common/enum/GenerationStatus';

export class GenerationStatusChangeEvent {
  generationId: string;
  status: GenerationStatus;

  constructor(generation_id: string, status: GenerationStatus) {
    this.generationId = generation_id;
    this.status = status;
  }
}
