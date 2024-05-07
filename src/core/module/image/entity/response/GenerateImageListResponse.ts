import { GenerateImageListResponseJson } from './GenerateImageListResponseJson';
import { ImageResponse } from './ImageResponse';
import { ImageResponseJson } from './ImageResponseJson';

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

  public addImage(image_response: ImageResponse): void {
    this.images.push(image_response);
  }

  public getGenerateId(): number {
    return this.generateId;
  }

  private imagesToJson(): ImageResponseJson[] {
    return this.images.map(image => image.toJson());
  }

  public toJson(): GenerateImageListResponseJson {
    return {
      style: this.style,
      prompt: this.prompt,
      images: this.imagesToJson(),
    };
  }
}
