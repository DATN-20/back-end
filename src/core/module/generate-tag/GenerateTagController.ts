import { AuthGuard } from '@core/common/guard/AuthGuard';
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GenerateTagService } from './GenerateTagService';
import { User } from '@core/common/decorator/UserDecorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('generate-tag')
export class GenerateTagController {
  constructor(private readonly generateTagService: GenerateTagService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async generateTag(
    @User() user: UserFromAuthGuard,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.generateTagService.handleGenerateTag(image?.buffer);
  }
}
