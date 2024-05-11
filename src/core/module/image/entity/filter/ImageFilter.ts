export class ImageFilter {
  public style: string;
  public prompt: string;
  public aiName: string;
  public imageType: string;

  constructor(style: string, prompt: string, aiName: string, imageType: string) {
    this.style = style;
    this.prompt = prompt;
    this.aiName = aiName;
    this.imageType = imageType;
  }
}
