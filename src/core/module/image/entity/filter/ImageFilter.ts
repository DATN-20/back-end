import { ImageType } from '@core/common/enum/ImageType';

export class ImageFilter {
  public style: string;
  public aiName: string;
  public imageType: ImageFilterType;

  constructor(style: string, aiName: string, imageType: ImageFilterType) {
    this.style = style;
    this.aiName = aiName;
    this.imageType = imageType;
  }
}

export enum ImageFilterType {
  UPLOADED = 'UPLOADED',
  IMG_TO_IMG = 'Image To Image',
  TEXT_TO_IMG = 'Text To Image',
  IMG_BY_IMAGES_STYLE = 'Image By Other Images Style',
  ALL = '%',
}
