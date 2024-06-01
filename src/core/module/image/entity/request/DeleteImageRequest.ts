import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidationError } from 'class-validator';

export class DeleteImageRequest {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(val => {
        const id = Number(val);
        if (isNaN(id)) {
          const error: ValidationError = {
            property: 'ids',
            constraints: {
              ids: 'ids must be array number',
            },
          };
          throw new Exception(ErrorBaseSystem.DYNAMIC_ENTITY_VALIDATION_ERROR(error));
        }

        return id;
      });
    }

    return value;
  })
  ids: number[];
}
