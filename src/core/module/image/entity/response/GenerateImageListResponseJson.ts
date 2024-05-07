import { ImageResponseJson } from './ImageResponseJson';

export interface GenerateImageListResponseJson {
  style: string;
  prompt: string;
  images: ImageResponseJson[];
}
