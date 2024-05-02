import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { LockedUserRepository } from '@core/module/user-management/repositories/LockedUserRepository';
import { UserController } from '@core/module/user/UserController';
import { UserRepository } from '@core/module/user/UserRepository';
import { UserService } from '@core/module/user/UserService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { Global, Module } from '@nestjs/common';

@Module({
  imports: [ImageStorageModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtUtil, LockedUserRepository],
  exports: [UserService, UserRepository, LockedUserRepository, JwtUtil],
})
export class UserModule {}
