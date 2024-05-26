import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class NotificationError {
  public static NOTIFICATION_NOT_FOUND: ErrorBase = {
    error_code: '10001',
    message: 'Notification is not found!',
    status_code: HttpStatus.NOT_FOUND,
  };

  public static FORBIDDEN_TO_TAKE_ACTION: ErrorBase = {
    error_code: '10002',
    message: 'You do not have permission to take action with this notification!',
    status_code: HttpStatus.FORBIDDEN,
  };
}
