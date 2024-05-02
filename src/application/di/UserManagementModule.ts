import { UserManagementController } from '@core/module/user-management/UserManagementController';
import { UserManagementService } from '@core/module/user-management/UserManagementService';
import { LockedUserRepository } from '@core/module/user-management/repositories/LockedUserRepository';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { MailModule } from '@infrastructure/external-services/mail/MailModule';

@Module({
  imports: [UserModule, MailModule],
  controllers: [UserManagementController],
  providers: [UserManagementService, LockedUserRepository],
  exports: [UserManagementService, LockedUserRepository],
})
export class UserManagementModule {}
