import { IsNotEmpty } from 'class-validator';

export class ImageAlbumRequest {
  @IsNotEmpty()
  idImage: number[];

  constructor(idImage: number[]) {
    this.idImage = idImage;
  }
}
