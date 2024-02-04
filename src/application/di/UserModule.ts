import { UserController } from '@core/module/user/UserController';
import { UserRepository } from '@core/module/user/UserRepository';
import { UserService } from '@core/module/user/UserService';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
