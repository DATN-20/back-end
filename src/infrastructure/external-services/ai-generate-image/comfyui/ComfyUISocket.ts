import { EnvironmentConverter } from '@core/common/util/converter/EnvironmentConverter';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { BaseSocketClient } from '@infrastructure/socket/BaseSocketClient';
import { v4 as uuidv4 } from 'uuid';
import { OutputPropertyWebSocket } from './ComfyUIConstant';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { GenerationService } from '@core/module/generation/GenerationService';
import { Injectable } from '@nestjs/common';

export enum ComfyUITypeMessageSocket {
  EXECUTING = 'executing',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
}

@Injectable()
export class ComfyUISokcet extends BaseSocketClient {
  private clientId: string;
  private generationService: GenerationService;

  constructor(generation_service: GenerationService, client_id: string = uuidv4()) {
    super(
      ComfyUIConfig.COMFYUI_NAME,
      `${EnvironmentConverter.convertWebSocketInSuitableEnvironment(
        ComfyUIConfig.COMFYUI_URL,
      )}/ws?clientId=${client_id}`,
    );
    this.clientId = client_id;
    this.generationService = generation_service;
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
            if (this.generationService) {
              this.generationService.handleChangeStatusOfGeneration(
                this.clientId,
                GenerationStatus.FINISHED,
              );
            }

            break;
          case ComfyUITypeMessageSocket.EXECUTING:
          case ComfyUITypeMessageSocket.PROGRESS:
            if (this.generationService) {
              this.generationService.handleChangeStatusOfGeneration(
                this.clientId,
                GenerationStatus.PROCESSING,
              );
            }

            break;
          default:
            break;
        }
      }
    });
  }
}
