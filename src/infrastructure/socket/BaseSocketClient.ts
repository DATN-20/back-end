import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

type ConnectionError = Error | WebSocket.ErrorEvent | WebSocket.CloseEvent;

export class BaseSocketClient {
  protected webSocket: WebSocket;
  protected logger: Logger;

  constructor(ai_name: string, ws_url: string) {
    this.webSocket = new WebSocket(ws_url);
    this.logger = new Logger(ai_name);
    this.connect();
  }

  private connect(): void {
    this.webSocket.on('open', () => {
      this.logger.log('Connected to websocket server');
    });

    this.webSocket.on('connect_error', (error: ConnectionError) => {
      this.logger.error('Connection error:', error);
    });
  }

  public disconnect(): void {
    this.webSocket.close();
  }
}
