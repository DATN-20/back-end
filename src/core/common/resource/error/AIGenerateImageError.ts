import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AIGenerateImageError {
  public static INVALID_AI_NAME: ErrorBase = {
    error_code: '04001',
    message: 'Invalid AI Name',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static INVALID_INPUT_VALUE(input_name: string): ErrorBase {
    return {
      error_code: '04002',
      message: `Input for "${input_name}" not valid`,
      status_code: HttpStatus.BAD_REQUEST,
    };
  }
}
