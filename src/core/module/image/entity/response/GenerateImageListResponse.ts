import { ImageResponse } from './ImageResponse';

export class GenerateImageListResponse {
  private style: string;
  private prompt: string;
  private images: ImageResponse[];
  private generateId: number;

  constructor(style: string, prompt: string, generateId: number) {
    this.style = style;
    this.prompt = prompt;
    this.images = [];
    this.generateId = generateId;
  }

  public addImage(image_response: ImageResponse) {
    this.images.push(image_response);
  }

  public getGenerateId() {
    return this.generateId;
  }

  private imagesToJson() {
    return this.images.map(image => image.toJson());
  }

  public toJson() {
    return {
      style: this.style,
      prompt: this.prompt,
      images: this.imagesToJson(),
    };
  }
}
