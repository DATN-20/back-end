import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { GenerationService } from './GenerationService';
import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { GenerationResponseJson } from './entity/response/GenerationResponseJson';
import { ParamValidator } from '@core/common/util/ParamValidator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserFromAuthGuard } from '@core/common/type/UserFromAuthGuard';

@ApiTags(GenerationController.name.replaceAll('Controller', ''))
@ApiBearerAuth()
@Controller('generations')
@UseGuards(AuthGuard)
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @ApiResponse({ status: HttpStatus.OK, type: GenerationResponseJson })
  @Get()
  async getGenerationsOfUser(@User() user: UserFromAuthGuard): Promise<GenerationResponseJson[]> {
    return this.generationService.handleGetGenerationsOfUser(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: GenerationResponseJson })
  @Get(':generationId')
  async getGeneration(
    @User() user: UserFromAuthGuard,
    @Param('generationId', ParamValidator) generation_id: string,
  ): Promise<GenerationResponseJson> {
    return this.generationService.handleGetGeneration(generation_id, user.id);
  }
}
