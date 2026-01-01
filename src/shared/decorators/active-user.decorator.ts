import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../types/token.type';
import { USER_KEY } from '../constants/auth';

export const ActiveUser = createParamDecorator(
  (field: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: AccessTokenPayload | undefined = request[USER_KEY];
    return field ? user?.[field] : user;
  },
);
