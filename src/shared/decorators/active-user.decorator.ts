import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../types/token.type';
import { USER_KEY } from '../constants/auth';

export const ActiveUser = createParamDecorator(
  (field: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: TokenPayload | undefined = request[USER_KEY];
    return field ? user?.[field] : user;
  },
);
