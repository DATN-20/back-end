import { IsOptional } from 'class-validator';

export class GenerateTagInput {
  @IsOptional()
  image: Express.Multer.File;
}
