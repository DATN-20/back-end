import { UserRole } from '@core/common/enum/UserRole';
import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
  id: number;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export enum JwtType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  MAIL_SIGN_UP = 'MAIL_SIGN_UP',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
}

@Global()
@Injectable()
export class JwtUtil {
  private TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signToken<T extends TokenPayload | CreateUserPayload>(payload: T, type: JwtType): string {
    return this.jwtService.sign(
      {
        ...payload,
      },
      {
        secret: this.configService.get(`JWT_${type}_KEY`),
        expiresIn: this.configService.get(`JWT_${type}_EXPIRED_TIME`),
      },
    );
  }

  verify<T extends TokenPayload | CreateUserPayload>(token: string, type: JwtType): T {
    try {
      const payload = this.jwtService.verify<T>(token, {
        secret: this.configService.get(`JWT_${type}_KEY`),
      });

      return payload;
    } catch (error) {
      if (error.name === this.TOKEN_EXPIRED_ERROR) {
        throw new Exception(ErrorBaseSystem.TOKEN_EXPIRED_TIME);
      }
    }
  }
}
