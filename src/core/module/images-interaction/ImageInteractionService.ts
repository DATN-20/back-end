import { Injectable } from '@nestjs/common';
import { ImageInteractionRepository } from './ImageInteractionRepository';

@Injectable()
export class ImageInteractionService {
  constructor(private readonly repository: ImageInteractionRepository) {}
}
