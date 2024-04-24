import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class ControlNetError {
  public static INVALID_CONTROL_NET_TYPE: ErrorBase = {
    error_code: '07001',
    message: 'Invalid ControlNet type!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
