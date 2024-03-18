import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditAlbumReq {
  @IsOptional()
  name: string;
}
