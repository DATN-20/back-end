import { IsNotEmpty } from 'class-validator';

export class DeleteImageRequest {
  @IsNotEmpty()
  ids: number[];
}
