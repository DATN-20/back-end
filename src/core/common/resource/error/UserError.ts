import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class UserError {
  public static USER_NOT_FOUND: ErrorBase = {
    error_code: '06001',
    message: 'User not found!',
    status_code: HttpStatus.NOT_FOUND,
  };
}
