import { AuthGuard } from '@core/common/guard/AuthGuard';
import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenerateTagService } from './GenerateTagService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(GenerateTagController.name.replaceAll('Controller', ''))
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('generate-tag')
export class GenerateTagController {
  constructor(private readonly generateTagService: GenerateTagService) {}

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async generateTag(@UploadedFile() image: Express.Multer.File): Promise<string> {
    return this.generateTagService.handleGenerateTag(image?.buffer);
  }
}
