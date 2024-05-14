import { GenerationStatus } from '@core/common/enum/GenerationStatus';

export class GenerationCreateNewEvent {
  generationId: string;
  userId: number;

  constructor(generation_id: string, user_id: number) {
    this.generationId = generation_id;
    this.userId = user_id;
  }
}
