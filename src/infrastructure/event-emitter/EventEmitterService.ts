import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GENERATION_STATUS_EVENT_CHANGED, GENERATION_STATUS_EVENT_CREATE } from './Constant';
import { GenerationStatusChangeEvent } from './events/GenerationStatusChangeEvent';
import { GenerationCreateNewEvent } from './events/GenerationCreateNewEvent';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitterGenerationStatusEvent(
    generation_id: string,
    status: GenerationStatus,
    user_id: number = null,
    is_new: boolean = false,
  ) {
    if (is_new && user_id) {
      this.eventEmitter.emit(
        GENERATION_STATUS_EVENT_CREATE,
        new GenerationCreateNewEvent(generation_id, user_id),
      );
      return;
    }

    this.eventEmitter.emit(
      GENERATION_STATUS_EVENT_CHANGED,
      new GenerationStatusChangeEvent(generation_id, status),
    );
  }
}
