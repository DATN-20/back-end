import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AiModelError {
  public static MODEL_IS_EXISTED: ErrorBase = {
    error_code: '07001',
    message: 'Model is existed!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
