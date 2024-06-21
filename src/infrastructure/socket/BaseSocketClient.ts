import SystemLogger from '@core/common/logger/SystemLoggerService';
import { SocketError } from '@core/common/resource/error/SocketError';
import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

export type ConnectionError = Error | WebSocket.ErrorEvent | WebSocket.CloseEvent | AggregateError;

export class BaseSocketClient {
  protected webSocket: WebSocket;
  protected logger: Logger;

  constructor(ai_name: string, ws_url: string) {
    this.webSocket = new WebSocket(ws_url);
    this.logger = new Logger(ai_name);
    this.connect();
  }

  private connect(): void {
    this.webSocket.on('error', (error: ConnectionError) => {
      SystemLogger.error(error.toString(), {
        error_code: SocketError.SOCKET_CANNOT_CONNECT.error_code,
        back_trace: null,
      });
    });
  }

  public disconnect(): void {
    this.webSocket.close();
  }
}
