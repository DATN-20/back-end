import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AIGenerateTagError extends Error {
  public static IMAGE_NOT_FOUND: ErrorBase = {
    error_code: '10001',
    message: 'Image not found',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
