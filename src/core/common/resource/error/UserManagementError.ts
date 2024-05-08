import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class UserManagementError {
  public static END_DATE_LESS_THAN_START_DATE: ErrorBase = {
    error_code: '08001',
    message: 'End date can not less than start date!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
