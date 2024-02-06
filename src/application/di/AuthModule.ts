import { AuthController } from '@core/module/auth/AuthController';
import { AuthService } from '@core/module/auth/AuthService';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { BcryptHash } from '@core/common/util/hash/BcryptHash';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { MailModule } from '@infrastructure/external-services/mail/MailModule';

@Module({
  imports: [UserModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptHash, JwtUtil],
  exports: [AuthService],
})
export class AuthModule { }
