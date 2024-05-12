import { ImageType } from '@core/common/enum/ImageType';

export class ImageFilter {
  public style: string;
  public aiName: string;
  public imageType: ImageFilterType;

  constructor(style: string, ai_name: string, image_type: ImageFilterType) {
    this.style = style;
    this.aiName = ai_name;
    this.imageType = image_type;
  }
}

export enum ImageFilterType {
  UPLOADED = 'UPLOADED',
  IMG_TO_IMG = 'Image To Image',
  TEXT_TO_IMG = 'Text To Image',
  IMG_BY_IMAGES_STYLE = 'Image By Other Images Style',
  ALL = 'ALL',
}
