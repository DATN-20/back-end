import { BaseRepository } from '@core/common/repository/BaseRepository';
import { AiModel } from './entity/AiModel';
import { AiType } from '@core/common/enum/AiType';
import { ModelType } from '@core/common/enum/ModelType';
import { ai_models } from '@infrastructure/orm/schema';
import { and, eq } from 'drizzle-orm';

export class AiModelRepository extends BaseRepository {
  async getByName(model_name: string): Promise<AiModel> {
    const query_result = await this.database.query.ai_models.findFirst({
      where: (ai_models, { eq }) => eq(ai_models.name, model_name),
    });

    return query_result;
  }

  async getByAiNameAndType(ai_name: AiType, type: ModelType = ModelType.MODEL): Promise<AiModel[]> {
    const query_result = await this.database
      .select()
      .from(ai_models)
      .where(and(eq(ai_models.aiName, ai_name), eq(ai_models.type, type)));

    return query_result;
  }

  async create(data: {
    name: string;
    aiName: AiType;
    type: ModelType;
    description: string;
    label: string;
  }): Promise<AiModel> {
    await this.database.insert(ai_models).values(data);

    return this.getByName(data.name);
  }
}
