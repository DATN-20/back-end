import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { Exception } from '../exception/Exception';

@Injectable()
export class ParamValidator<T> implements PipeTransform<string, T> {
  transform(value: string, metadata: ArgumentMetadata): T {
    const expected_type = metadata.metatype;

    if (expected_type === Number) {
      const val = parseInt(value, 10);

      if (isNaN(val)) {
        throw new Exception(ErrorBaseSystem.INVALID_PARAM(metadata.data));
      }

      return val as T;
    } else if (expected_type === String) {
      return value.trim() as T;
    } else {
      throw new Exception(ErrorBaseSystem.INVALID_PARAM(metadata.data));
    }
  }
}
