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
    message: 'Mail is not matched with any user!',
    status_code: HttpStatus.BAD_REQUEST,
  };
  public static INVALID_TOKEN_USER: ErrorBase = {
    error_code: '01004',
    message: 'Invalid token!',
    status_code: HttpStatus.FORBIDDEN,
  };
  public static INVALID_VERIFY_TOKEN: ErrorBase = {
    error_code: '01005',
    message: 'Invalid verify token!',
    status_code: HttpStatus.FORBIDDEN,
  };
}
