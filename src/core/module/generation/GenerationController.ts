import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GenerationService } from './GenerationService';
import { User } from '@core/common/decorator/UserDecorator';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { GenerationResponseJson } from './entity/response/GenerationResponseJson';
import { ParamValidator } from '@core/common/util/ParamValidator';

@Controller('generations')
@UseGuards(AuthGuard)
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Get()
  async getGenerationsOfUser(@User() user: UserFromAuthGuard): Promise<GenerationResponseJson[]> {
    return this.generationService.handleGetGenerationsOfUser(user.id);
  }

  @Get(':generationId')
  async getGeneration(
    @User() user: UserFromAuthGuard,
    @Param('generationId', ParamValidator) generation_id: string,
  ): Promise<GenerationResponseJson> {
    return this.generationService.handleGetGeneration(generation_id, user.id);
  }
}
