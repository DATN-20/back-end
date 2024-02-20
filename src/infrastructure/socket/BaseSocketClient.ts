import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

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

    this.webSocket.on('connect_error', (error) => {
      this.logger.error('Connection error:', error);
    });
  }

  public disconnect(): void {
    this.webSocket.close();
  }

  public receiveMessage(): void {
    this.webSocket.on('message', (message) => {
      const { type, data } = JSON.parse(message.toString('utf-8'));
      console.log(type);
      console.log(data);
    });
  }
}
