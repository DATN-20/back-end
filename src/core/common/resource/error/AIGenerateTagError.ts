import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AIGenerateTagError extends Error {
  public static IMAGE_IS_REQUIRED: ErrorBase = {
    error_code: '10001',
    message: 'Image is required to generate tags',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
