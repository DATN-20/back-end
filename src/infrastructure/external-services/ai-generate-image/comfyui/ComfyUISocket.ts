import { EnvironmentConverter } from '@core/common/util/converter/EnvironmentConverter';
import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { BaseSocketClient } from '@infrastructure/socket/BaseSocketClient';
import { v4 as uuidv4 } from 'uuid';
import { OutputPropertyWebSocket } from './ComfyUIConstant';

export enum ComfyUITypeMessageSocket {
  EXECUTING = 'executing',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
}

export class ComfyUISokcet extends BaseSocketClient {
  private clientId: string;

  constructor() {
    const client_id = uuidv4();
    super(
      ComfyUIConfig.COMFYUI_NAME,
      `${EnvironmentConverter.convertWebSocketInSuitableEnvironment(
        ComfyUIConfig.COMFYUI_URL,
      )}/ws?clientId=${client_id}`,
    );
    this.clientId = client_id;
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

      if (type === ComfyUITypeMessageSocket.EXECUTED && data.prompt_id === prompt_id) {
        const output_data = data.output[property];
        callback(output_data);
      }
    });
  }
}
