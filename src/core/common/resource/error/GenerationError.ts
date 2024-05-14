import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';
import { MAXIMUM_THE_NUMBER_OF_GENERATIONS } from '@core/common/constant/Constant';

export class GenerationError {
  public static FORBIDDEN_VIEW_GENERATION: ErrorBase = {
    error_code: '09001',
    message: 'You do not have permission to view this generation!',
    status_code: HttpStatus.FORBIDDEN,
  };

  public static REACH_TO_MAXIMUM_TIMES: ErrorBase = {
    error_code: '09002',
    message: `You reached to maximum the number of times generation. Maximum is ${MAXIMUM_THE_NUMBER_OF_GENERATIONS}!`,
    status_code: HttpStatus.FORBIDDEN,
  };
}
