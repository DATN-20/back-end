import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class SocketError {
  public static SOCKET_CANNOT_CONNECT: ErrorBase = {
    error_code: '12001',
    message: 'Socket cannot connect',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
