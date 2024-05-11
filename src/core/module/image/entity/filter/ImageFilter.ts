import { ImageType } from '@core/common/enum/ImageType';

export class ImageFilter {
  public style: string;
  public prompt: string;
  public aiName: string;
  public imageType: ImageType;

  constructor(style: string, prompt: string, aiName: string, imageType: ImageType) {
    this.style = style;
    this.prompt = prompt;
    this.aiName = aiName;
    this.imageType = imageType;
  }
}
