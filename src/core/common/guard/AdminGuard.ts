import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtType, JwtUtil, TokenPayload } from '../util/jwt/JwtUtil';
import { UserRepository } from '@core/module/user/UserRepository';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { Exception } from '../exception/Exception';
import { UserRole } from '../enum/UserRole';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtUtil: JwtUtil, private readonly userRepository: UserRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.header('Authorization');
    const token = authorization && authorization.split(' ')[1];

    const user_id = this.jwtUtil.verify<TokenPayload>(token, JwtType.ACCESS).id;
    const matched_user = await this.userRepository.getById(user_id);

    if (!matched_user || matched_user.accessToken !== token) {
      throw new Exception(ErrorBaseSystem.UNAUTHORIZE_TOKEN);
    }

    if (matched_user.role !== UserRole.ADMIN) {
      throw new Exception(ErrorBaseSystem.FORBIDDEN_RESOURCE);
    }

    request.user = {
      id: user_id,
    };

    return true;
  }
}
