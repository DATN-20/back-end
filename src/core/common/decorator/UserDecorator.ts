import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TokenPayload } from '../util/jwt/JwtUtil';
import { UserFromAuthGuard } from '../type/UserFromAuthGuard';

export const User = createParamDecorator((_data: TokenPayload, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserFromAuthGuard;
});
