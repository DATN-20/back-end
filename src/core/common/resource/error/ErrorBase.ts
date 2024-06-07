import { DateUtil } from '@core/common/util/DateUtil';
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
    let error_message = '';
    if (error['constraints']) {
      error_message = Object.values(error.constraints).join('\n');
    }

    if (!error['constraints'] && error['children'] && error.children.length > 0) {
      error_message = Object.values(error.children[0].children[0].constraints).join('\n');
    }

    return {
      error_code: '00007',
      message: error_message,
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

  public static TOO_MANY_REQUEST_TO_ENDPOINT = (
    bucket_size: number,
    expired_at: Date,
  ): ErrorBase => {
    const reste_date = DateUtil.formatDate(expired_at);

    return {
      error_code: '00009',
      message: `Too many requests have been made to this endpoint. You only have a maximum of ${bucket_size} request times. Now, it's out of times! Requests will reset at ${reste_date}.`,
      status_code: HttpStatus.TOO_MANY_REQUESTS,
    };
  };

  public static REQUIRED_IMAGE: ErrorBase = {
    error_code: '00009',
    message: 'Image is required!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static CANNOT_CONVERT_TO_BUFFER_FROM_URL: ErrorBase = {
    error_code: '00010',
    message: 'Can not convert to buffer from url!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
