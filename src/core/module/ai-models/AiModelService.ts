import { Injectable } from '@nestjs/common';
import { AiModelRepository } from './AiModelRepository';
import { CreateAiModelRequest } from './entity/request/CreateAiModelRequest';
import { Exception } from '@core/common/exception/Exception';
import { AiModelError } from '@core/common/resource/error/AiModelError';
import { AiModelResponse } from './entity/response/AiModelResponse';

@Injectable()
export class AiModelService {
  constructor(private readonly aiModelRepository: AiModelRepository) {}

  async handleCreateNewAiModel(data: CreateAiModelRequest): Promise<AiModelResponse> {
    const is_existed = await this.aiModelRepository.getByName(data.name);

    if (is_existed) {
      throw new Exception(AiModelError.MODEL_IS_EXISTED);
    }

    const new_ai_model = await this.aiModelRepository.create(data);
    return AiModelResponse.convertFromAiModel(new_ai_model);
  }
}
