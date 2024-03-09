import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';
import { InteractionType } from '@core/common/enum/InteractionType';

export class ImageError {
  public static FAIL_TO_UPLOAD_IMAGE: ErrorBase = {
    error_code: '03001',
    message: 'Fail to upload image to Storage Image Service.',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static FAIL_TO_DELETE_IMAGE: ErrorBase = {
    error_code: '03002',
    message: 'Fail to delete image from Storage Image Service.',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static UPLOAD_ERROR: ErrorBase = {
    error_code: '03003',
    message: 'Fail to upload image',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static DELETE_ERROR: ErrorBase = {
    error_code: '03004',
    message: 'Fail to delete image',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static IMAGE_NOT_FOUND: ErrorBase = {
    error_code: '03005',
    message: 'Image not found',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static GET_ERROR: ErrorBase = {
    error_code: '03005',
    message: 'Fail to get user image',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static IMAGES_LIST_EMPTY: ErrorBase = {
    error_code: '03005',
    message: 'Images list can not empty',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static CAN_NOT_INTERACT_IMAGE(type: InteractionType): ErrorBase {
    return {
      error_code: '03006',
      message: `You are ${type} this image so you can not ${type} again!`,
      status_code: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
