import { ComfyUIConfig } from '@infrastructure/config/ComfyUIConfig';
import { BaseSocketClient } from '@infrastructure/socket/BaseSocketClient';
import { v4 as uuidv4 } from 'uuid';

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
}
