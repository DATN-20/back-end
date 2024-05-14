import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { Generation } from '../Generation';
import { GenerationResponseJson } from './GenerationResponseJson';

export class GenerationResponse {
  private id: string;
  private userId: number;
  private status: GenerationStatus;

  constructor(id: string, status: GenerationStatus, user_id: number) {
    this.id = id;
    this.status = status;
    this.userId = user_id;
  }

  public static convertFromEntity(entity: Generation): GenerationResponse {
    return new GenerationResponse(entity.id, entity.status, entity.userId);
  }

  toJson(): GenerationResponseJson {
    return {
      id: this.id,
      status: this.status,
    };
  }
}
