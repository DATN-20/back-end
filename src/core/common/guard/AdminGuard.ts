import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { Exception } from '../exception/Exception';
import { UserRole } from '../enum/UserRole';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user_from_request = request.user;
    if (user_from_request.role !== UserRole.ADMIN) {
      throw new Exception(ErrorBaseSystem.FORBIDDEN_ACCESS_API);
    }

    return true;
  }
}
