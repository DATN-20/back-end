import { GenerationController } from '@core/module/generation/GenerationController';
import { GenerationListener } from '@core/module/generation/GenerationListener';
import { GenerationRepository } from '@core/module/generation/GenerationRepository';
import { GenerationService } from '@core/module/generation/GenerationService';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { MailModule } from '@infrastructure/external-services/mail/MailModule';

@Module({
  imports: [UserModule, MailModule],
  controllers: [GenerationController],
  providers: [GenerationService, GenerationRepository, GenerationListener],
  exports: [GenerationService, GenerationRepository],
})
export class GenerationModule {}
