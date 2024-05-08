import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class UserError {
  public static USER_NOT_FOUND: ErrorBase = {
    error_code: '06001',
    message: 'User not found!',
    status_code: HttpStatus.NOT_FOUND,
  };

  public static FAILED_TO_UPDATE_AVATAR: ErrorBase = {
    error_code: '06002',
    message: 'Failed to update avatar!',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static FAILED_TO_UPDATE_BACKGROUND: ErrorBase = {
    error_code: '06003',
    message: 'Failed to update background !',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
