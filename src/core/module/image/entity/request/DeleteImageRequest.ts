import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeleteImageRequest {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(val => {
        const id = Number(val);
        if (isNaN(id)) {
          throw new Exception(ErrorBaseSystem.VALIDATION_REQUEST_DATA_FAILED);
        }
      });
    }

    return value;
  })
  ids: number[];
}
