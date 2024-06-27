import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class DatabaseError {
  public static DATABASE_CONNECTION_LOST: ErrorBase = {
    error_code: '13001',
    message: 'Database connection lost!',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
