import { AuthGuard } from '@core/common/guard/AuthGuard';
import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GenerateTagService } from './GenerateTagService';
import { User } from '@core/common/decorator/UserDecorator';
import { GenerateInputs } from '../generate-image/entity/request/GenerateInputs';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateTagInput } from './entity/request/GenerateTagInput';
// @UseGuards(AuthGuard)
@Controller('generate-tag')
export class GenerateTagController {
  constructor(private readonly generateTagService: GenerateTagService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async generateTag(
    @User() user: UserFromAuthGuard,
    @UploadedFile() image: Express.Multer.File,
    @Body() generate_inputs: GenerateTagInput,
  ): Promise<string> {
    generate_inputs.image = image;

    return await this.generateTagService.handleGenerateTag(generate_inputs);
  }
}
