import { IsNotEmpty } from 'class-validator';

export class DeleteAlbumReq {
  @IsNotEmpty()
  albumIds: number[];
}
