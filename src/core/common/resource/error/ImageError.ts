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

  public static FORBIDDEN_IMAGES: ErrorBase = {
    error_code: '03007',
    message: 'You are not have permission to access to this image!',
    status_code: HttpStatus.FORBIDDEN,
  };

  public static IMAGE_REMOVED_BACKGROUD: ErrorBase = {
    error_code: '03007',
    message: 'This image is removed background!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static IMAGE_UPSCALED: ErrorBase = {
    error_code: '03008',
    message: 'This image is upscaled!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static INVALID_PROCESS_TYPE: ErrorBase = {
    error_code: '03009',
    message: 'Invalid processing type!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static CAN_NOT_VIEW_PRIVATE_IMAGE: ErrorBase = {
    error_code: '03010',
    message: 'This image is private by their owner. You dont have permission to view!',
    status_code: HttpStatus.BAD_REQUEST,
  };

  public static FAIL_TO_CHANGE_VISIBILITY: ErrorBase = {
    error_code: '03011',
    message: 'Fail to change visibility of image',
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  public static NO_IMAGES_BELONG_TO_GENERATION: ErrorBase = {
    error_code: '03012',
    message: 'No images are belong to this generation!',
    status_code: HttpStatus.BAD_REQUEST,
  };
}
