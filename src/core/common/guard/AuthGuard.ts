import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtType, JwtUtil, TokenPayload } from '../util/jwt/JwtUtil';
import { UserRepository } from '@core/module/user/UserRepository';
import { Exception } from '../exception/Exception';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { LockedUserRepository } from '@core/module/user-management/repositories/LockedUserRepository';
import { LockedUserError } from '../resource/error/LockedUserError';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly userRepository: UserRepository,
    private readonly lockedUserRepository: LockedUserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.header('Authorization');
    if (authorization === undefined) {
      throw new Exception(ErrorBaseSystem.UNAUTHORIZE_TOKEN);
    }

    const token = authorization && authorization.split(' ')[1];

    const user_id = this.jwtUtil.verify<TokenPayload>(token, JwtType.ACCESS).id;
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user || matched_user.accessToken !== token) {
      throw new Exception(ErrorBaseSystem.UNAUTHORIZE_TOKEN);
    }

    const locked_user = await this.lockedUserRepository.getByUserId(matched_user.id);
    if (!locked_user) {
      request.user = {
        id: user_id,
      };

      return true;
    }

    const current_date = new Date();

    if (locked_user.expiredAt < current_date) {
      await this.lockedUserRepository.delete(matched_user.id);
    } else {
      throw new Exception(LockedUserError.USER_IS_LOCKED(locked_user.lockedAt));
    }

    request.user = {
      id: user_id,
    };

    return true;
  }
}
