import { Injectable } from '@nestjs/common';
import { GenerationRepository } from './GenerationRepository';
import { GenerationResponseJson } from './entity/response/GenerationResponseJson';
import { GenerationResponse } from './entity/response/GenerationResponse';
import { Exception } from '@core/common/exception/Exception';
import { GenerationError } from '@core/common/resource/error/GenerationError';
import { v4 as uuidv4 } from 'uuid';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { MAXIMUM_THE_NUMBER_OF_GENERATIONS } from '@core/common/constant/Constant';

@Injectable()
export class GenerationService {
  constructor(private readonly generationRepository: GenerationRepository) {}

  async handleGetGenerationsOfUser(user_id: number): Promise<GenerationResponseJson[]> {
    const generations = await this.generationRepository.getByUserId(user_id);

    return generations.map(generation => {
      return GenerationResponse.convertFromEntity(generation).toJson();
    });
  }

  async handleGetGeneration(
    generation_id: string,
    user_id: number,
  ): Promise<GenerationResponseJson> {
    const generation = await this.generationRepository.getById(generation_id);

    if (generation.userId !== user_id) {
      throw new Exception(GenerationError.FORBIDDEN_VIEW_GENERATION);
    }

    return GenerationResponse.convertFromEntity(generation).toJson();
  }

  async handleCreateGenerationForUser(user_id: number): Promise<GenerationResponseJson> {
    const generations = await this.generationRepository.getByUserId(user_id);

    if (generations.length >= MAXIMUM_THE_NUMBER_OF_GENERATIONS) {
      throw new Exception(GenerationError.REACH_TO_MAXIMUM_TIMES);
    }

    const id = uuidv4();
    return this.generationRepository.create(id, GenerationStatus.WAITING, user_id);
  }
}
