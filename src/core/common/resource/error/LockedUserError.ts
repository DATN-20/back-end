import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';
import { DateUtil } from '@core/common/util/DateUtil';

export class LockedUserError {
  public static INVALID_TYPE_LOCKED_USER: ErrorBase = {
    error_code: '07001',
    message: 'Invalid type locked user!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static USER_IS_LOCKED(locked_at: Date): ErrorBase {
    return {
      error_code: '07002',
      message: `User is locked at ${DateUtil.formatDate(
        locked_at,
      )}! Please check your mail to view detail!`,
      status_code: HttpStatus.BAD_REQUEST,
    };
  }

  public static USER_IS_NOT_LOCKED: ErrorBase = {
    error_code: '07003',
    message: 'User is not locked so can not unlock!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
