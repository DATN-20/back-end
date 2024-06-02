import { HttpStatus, ValidationError } from '@nestjs/common';

export type ErrorBase = {
  error_code: string;
  message: string;
  status_code: HttpStatus;
  error?: any;
  raw_input?: any;
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
    message: 'You do not have permission to access this resource!',
    status_code: HttpStatus.FORBIDDEN,
  };
  public static FORBIDDEN_ACCESS_API: ErrorBase = {
    error_code: '00006',
    message: 'You do not have permission to access this API!',
    status_code: HttpStatus.FORBIDDEN,
  };
  public static DYNAMIC_ENTITY_VALIDATION_ERROR = (error: ValidationError): ErrorBase => {
    return {
      error_code: '00007',
      message: Object.values(error.constraints).join('/n'),
      status_code: HttpStatus.BAD_REQUEST,
      raw_input: error.target,
    };
  };
  public static INVALID_PARAM = (field: string): ErrorBase => {
    return {
      error_code: '00008',
      message: `${field} is invalid!`,
      status_code: HttpStatus.BAD_REQUEST,
    };
  };
}
