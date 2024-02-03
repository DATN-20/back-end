import { HttpStatus } from '@nestjs/common';

export type ErrorBase = {
  error_code: string;
  message: string;
  status_code: HttpStatus;
};

export class ErrorBaseSystem {
  public static ENTITY_VALIDATION_ERROR: ErrorBase = {
    error_code: '00001',
    message: 'Entity validation error',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
