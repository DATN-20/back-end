import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { Generation } from '../Generation';
import { GenerationResponseJson } from './GenerationResponseJson';

export class GenerationResponse {
  private id: string;
  private userId: number;
  private status: GenerationStatus;
  private createdAt: Date;

  constructor(id: string, status: GenerationStatus, user_id: number, created_at: Date) {
    this.id = id;
    this.status = status;
    this.userId = user_id;
    this.createdAt = created_at;
  }

  public static convertFromEntity(entity: Generation): GenerationResponse {
    return new GenerationResponse(entity.id, entity.status, entity.userId, entity.createdAt);
  }

  toJson(): GenerationResponseJson {
    return {
      id: this.id,
      status: this.status,
      created_at: this.createdAt,
    };
  }
}
