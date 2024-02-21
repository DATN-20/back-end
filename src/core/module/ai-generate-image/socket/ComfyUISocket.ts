import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { BaseSocketClient } from '@infrastructure/socket/BaseSocketClient';
import { v4 as uuidv4 } from 'uuid';

export enum ComfyUITypeMessageSocket {
  EXECUTING = 'executing',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
}

export class ComfyUISokcet extends BaseSocketClient {
  protected clientId: string;

  constructor() {
    const client_id = uuidv4();
    super(
      ComfyUIConfig.COMFYUI_NAME,
      `wss://${ComfyUIConfig.COMFYUI_URL}/ws?clientId=${client_id}`,
    );
    this.clientId = client_id;
  }

  public getExecutedResultFromMessage(
    prompt_id: string,
    callback: (output_images: any) => void,
  ): void {
    this.webSocket.on('message', (message) => {
      const { type, data } = JSON.parse(message.toString('utf-8'));

      if (type === ComfyUITypeMessageSocket.EXECUTED && data.prompt_id === prompt_id) {
        const output_images = data.output.images;
        callback(output_images);
      }
    });
  }
}
