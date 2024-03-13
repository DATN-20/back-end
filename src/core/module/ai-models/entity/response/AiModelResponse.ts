import { AiModel } from '../AiModel';

export class AiModelResponse {
  private name: string;
  private aiName: string;
  private type: string;
  private description: string;
  private label: string;
  private createdAt: Date;
  private updatedAt: Date;

  public constructor(data: AiModel) {
    this.name = data.name;
    this.aiName = data.aiName;
    this.type = data.type;
    this.description = data.description;
    this.label = data.label;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public static convertFromAiModel(data: AiModel) {
    return new AiModelResponse(data);
  }

  public toJson() {
    return {
      name: this.name,
      ai_name: this.aiName,
      type: this.type,
      description: this.description,
      label: this.label,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
