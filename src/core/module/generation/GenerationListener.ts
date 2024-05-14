import {
  GENERATION_STATUS_EVENT_CHANGED,
  GENERATION_STATUS_EVENT_CREATE,
} from '@infrastructure/event-emitter/Constant';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerationRepository } from './GenerationRepository';
import { GenerationStatusChangeEvent } from '@infrastructure/event-emitter/events/GenerationStatusChangeEvent';
import { GenerationCreateNewEvent } from '@infrastructure/event-emitter/events/GenerationCreateNewEvent';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { UserRepository } from '../user/UserRepository';
import { MailSubject } from '@core/common/enum/MailSubject';
import { MailTemplate } from '@core/common/enum/MailTemplate';
import { User } from '../user/entity/User';
import { Generation } from './entity/Generation';
import { FrontEndConfig } from '@infrastructure/config/FrontEndConfig';

@Injectable()
export class GenerationListener {
  private logger: Logger;
  constructor(
    private readonly generationRepository: GenerationRepository,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
  ) {
    this.logger = new Logger(GenerationListener.name);
  }

  @OnEvent(GENERATION_STATUS_EVENT_CHANGED)
  async handleChangeGenerationStatusEvent(event: GenerationStatusChangeEvent): Promise<void> {
    const matched_generation = await this.generationRepository.getById(event.generationId);

    if (!matched_generation) {
      return;
    }

    if (matched_generation.status === event.status) {
      return;
    }

    const matched_user = await this.userRepository.getById(matched_generation.userId);
    if (matched_generation.status === event.status && matched_generation.status) {
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

    const updated_generation = await this.generationRepository.updateStatus(
      event.generationId,
      event.status,
    );

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

  @OnEvent(GENERATION_STATUS_EVENT_CREATE)
  async handleCreateNewGenerationStatusEvent(event: GenerationCreateNewEvent): Promise<void> {
    const generations = await this.generationRepository.getByUserId(event.userId);

    if (generations.length >= 3) {
      return;
    }
    const new_generation = await this.generationRepository.create(
      event.generationId,
      GenerationStatus.WAITING,
      event.userId,
    );

    const matched_user = await this.userRepository.getById(event.userId);
    await this.mailService.sendMail<{ user: User; generation: Generation }>(
      matched_user.email,
      MailSubject.GENERATION_STATUS.replace('%%status%%', GenerationStatus.WAITING),
      MailTemplate.GENERATION_STATUS,
      {
        user: matched_user,
        generation: new_generation,
      },
    );

    await this.generationRepository.updateIsSentMail(new_generation.id, true);
  }
}
