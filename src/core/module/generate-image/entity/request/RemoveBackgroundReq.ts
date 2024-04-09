import { IsNotEmpty } from 'class-validator';

export class RemoveBackgroundReq {
  @IsNotEmpty()
  image: string;
}
