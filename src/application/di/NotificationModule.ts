import { NotifiationController } from '@core/module/notifications/NotificationController';
import { NotificationRepository } from '@core/module/notifications/NotificationRepository';
import { NotificationService } from '@core/module/notifications/NotificationService';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule, InfrastructureModule],
  controllers: [NotifiationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
