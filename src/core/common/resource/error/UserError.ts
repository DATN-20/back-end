import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class UserError {
  public static USER_NOT_FOUND: ErrorBase = {
    error_code: '05001',
    message: 'User not found!',
    status_code: HttpStatus.NOT_FOUND,
  };
  public static POST_ERROR: ErrorBase = {
    error_code: '05003',
    message: 'Post error!, image or album is not exist',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
