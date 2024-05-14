import { Injectable } from '@nestjs/common';
import { GenerationRepository } from './GenerationRepository';
import { GenerationResponseJson } from './entity/response/GenerationResponseJson';
import { GenerationResponse } from './entity/response/GenerationResponse';
import { Exception } from '@core/common/exception/Exception';
import { GenerationError } from '@core/common/resource/error/GenerationError';
import { v4 as uuidv4 } from 'uuid';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { MAXIMUM_THE_NUMBER_OF_GENERATIONS } from '@core/common/constant/Constant';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { UserRepository } from '../user/UserRepository';
import { Generation } from './entity/Generation';
import { User } from '../user/entity/User';
import { MailSubject } from '@core/common/enum/MailSubject';
import { MailTemplate } from '@core/common/enum/MailTemplate';
import { FrontEndConfig } from '@infrastructure/config/FrontEndConfig';
import { DateUtil } from '@core/common/util/DateUtil';

@Injectable()
export class GenerationService {
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
  ) {}

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

  async handleDeleteById(generation_id: string): Promise<void> {
    const matched_generation = await this.generationRepository.getById(generation_id);

    if (!matched_generation) {
      throw new Exception(GenerationError.GENERATION_NOT_FOUND);
    }

    const matched_user = await this.userRepository.getById(matched_generation.userId);
    await this.mailService.sendMail<{ requestedAt: string }>(
      matched_user.email,
      MailSubject.GENERATION_CANCELED,
      MailTemplate.GENERATION_CANCELED,
      {
        requestedAt: DateUtil.formatDate(matched_generation.createdAt),
      },
    );

    await this.generationRepository.deleteById(generation_id);
  }

  async handleChangeStatusOfGeneration(
    generation_id: string,
    status: GenerationStatus,
  ): Promise<void> {
    const matched_generation = await this.generationRepository.getById(generation_id);
    if (!matched_generation) {
      throw new Exception(GenerationError.GENERATION_NOT_FOUND);
    }

    if (matched_generation.status === status) {
      return;
    }

    const matched_user = await this.userRepository.getById(matched_generation.userId);
    if (matched_generation.status === status && !matched_generation.isSentMail) {
      await this.mailService.sendMail<{ user: User; generation: Generation; urlRedirect: string }>(
        matched_user.email,
        MailSubject.GENERATION_STATUS.replace('%%status%%', matched_generation.status),
        MailTemplate.GENERATION_STATUS,
        {
          user: matched_user,
          generation: matched_generation,
          urlRedirect: FrontEndConfig.FRONT_END_URL,
        },
      );

      await this.generationRepository.updateIsSentMail(matched_generation.id, true);
      return;
    }

    const updated_generation = await this.generationRepository.updateStatus(generation_id, status);

    if (!updated_generation.isSentMail) {
      await this.mailService.sendMail<{ user: User; generation: Generation; urlRedirect: string }>(
        matched_user.email,
        MailSubject.GENERATION_STATUS.replace('%%status%%', updated_generation.status),
        MailTemplate.GENERATION_STATUS,
        {
          user: matched_user,
          generation: updated_generation,
          urlRedirect: FrontEndConfig.FRONT_END_URL,
        },
      );

      await this.generationRepository.updateIsSentMail(updated_generation.id, true);
    }

    if (updated_generation.status === GenerationStatus.FINISHED) {
      await this.generationRepository.deleteById(updated_generation.id);
    }
  }
}
