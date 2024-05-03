import { HttpStatus } from '@nestjs/common';

export type ErrorBase = {
  error_code: string;
  message: string;
  status_code: HttpStatus;
  error?: any;
};

export class ErrorBaseSystem {
  public static ENTITY_VALIDATION_ERROR: ErrorBase = {
    error_code: '00001',
    message: 'Entity validation error',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
  public static VALIDATION_REQUEST_DATA_FAILED: ErrorBase = {
    error_code: '00002',
    message: 'Validation failed!',
    status_code: HttpStatus.BAD_REQUEST,
  };
  public static TOKEN_EXPIRED_TIME: ErrorBase = {
    error_code: '00003',
    message: 'Token expired time!',
    status_code: HttpStatus.UNAUTHORIZED,
  };
  public static UNAUTHORIZE_TOKEN: ErrorBase = {
    error_code: '00004',
    message: 'Unauthorize token!',
    status_code: HttpStatus.UNAUTHORIZED,
  };
  public static INTERNAL_SERVER_ERROR: ErrorBase = {
    error_code: '00005',
    message: 'Internal server error!',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
  public static FORBIDDEN_RESOURCE: ErrorBase = {
    error_code: '00006',
    message: 'You do not have permission to access this API!',
    status_code: HttpStatus.FORBIDDEN,
  };
}
