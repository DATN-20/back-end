import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AuthError {
  public static WRONG_USERNAME_OR_PASSWORD: ErrorBase = {
    error_code: '01001',
    message: 'Username or password is wrong',
    status_code: HttpStatus.BAD_REQUEST,
  };
  public static MAIL_USED_BY_ANOTHER_USER: ErrorBase = {
    error_code: '01002',
    message: 'Email is used by another user!',
    status_code: HttpStatus.BAD_REQUEST,
  };
  public static MAIL_NOT_MATCHED_WITH_ANY_USER: ErrorBase = {
    error_code: '01003',
    message: 'Mail is matched with any user!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
