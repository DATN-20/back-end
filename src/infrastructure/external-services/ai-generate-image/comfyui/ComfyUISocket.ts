import { EnvironmentConverter } from '@core/common/util/converter/EnvironmentConverter';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { BaseSocketClient } from '@infrastructure/socket/BaseSocketClient';
import { v4 as uuidv4 } from 'uuid';
import { OutputPropertyWebSocket } from './ComfyUIConstant';
import { EventEmitterService } from '@infrastructure/event-emitter/EventEmitterService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';

export enum ComfyUITypeMessageSocket {
  EXECUTING = 'executing',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
}

export class ComfyUISokcet extends BaseSocketClient {
  private clientId: string;
  private eventEmitterService: EventEmitterService;

  constructor(client_id: string = uuidv4()) {
    super(
      ComfyUIConfig.COMFYUI_NAME,
      `${EnvironmentConverter.convertWebSocketInSuitableEnvironment(
        ComfyUIConfig.COMFYUI_URL,
      )}/ws?clientId=${client_id}`,
    );
    this.clientId = client_id;
    this.eventEmitterService = new EventEmitterService(new EventEmitter2());
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getExecutedResultFromMessage(
    prompt_id: string,
    property: OutputPropertyWebSocket,
    callback: (output_data: any) => void,
  ): void {
    this.webSocket.on('message', message => {
      const { type, data } = JSON.parse(message.toString('utf-8'));

      if (data.prompt_id === prompt_id) {
        switch (type) {
          case ComfyUITypeMessageSocket.EXECUTED:
            const output_data = data.output[property];

            callback(output_data);
            this.eventEmitterService.emitterGenerationStatusEvent(
              this.clientId,
              GenerationStatus.FINISHED,
            );

            break;
          case ComfyUITypeMessageSocket.EXECUTING:
            this.eventEmitterService.emitterGenerationStatusEvent(
              this.clientId,
              GenerationStatus.PROCESSING,
            );
            break;
          default:
            break;
        }
      }
    });
  }
}
