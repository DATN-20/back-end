import { IsNotEmpty } from 'class-validator';

export class CreateAlbumReq {
  @IsNotEmpty()
  name: string;
}
