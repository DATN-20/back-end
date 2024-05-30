import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class AlbumError {
  public static ALBUM_NOT_EXIST: ErrorBase = {
    error_code: '05001',
    message: 'Album not exist',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static NOT_OWNER_OF_ALBUM: ErrorBase = {
    error_code: '05002',
    message: 'You are not owner of this album',
    status_code: HttpStatus.FORBIDDEN,
  };

  public static BAD_EDIT_REQUEST: ErrorBase = {
    error_code: '05003',
    message: 'Edit request must contain at least one field to edit.',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static DUPLICATE_IMAGE: ErrorBase = {
    error_code: '05004',
    message: 'Image already exists',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static IMAGE_NOT_EXITS: ErrorBase = {
    error_code: '05005',
    message: 'Image does not exists',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
