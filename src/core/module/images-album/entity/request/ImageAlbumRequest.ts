import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidationError } from 'class-validator';

export class ImageAlbumRequest {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(val => {
        const id = Number(val);
        if (isNaN(id)) {
          const error: ValidationError = {
            property: 'ImageIds',
            constraints: {
              ImageIds: 'ImageIds must be array number',
            },
          };
          throw new Exception(ErrorBaseSystem.DYNAMIC_ENTITY_VALIDATION_ERROR(error));
        }
      });
    }

    return value;
  })
  imageIds: number[];
}
