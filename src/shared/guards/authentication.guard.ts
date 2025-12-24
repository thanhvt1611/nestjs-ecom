import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APIKeyGuard } from './api-key.guard';
import { AccessTokenGuard } from './access-token.guard';
import {
  AUTH_KEY,
  AuthDecoratorPayload,
  AuthKey,
  ConditionKey,
} from '../constants/auth';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private get authTypeGuardMap() {
    return {
      [AuthKey.Bearer]: this.accessToken,
      [AuthKey.APIKey]: this.apiKey,
      [AuthKey.None]: { canActivate: () => true },
    };
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly accessToken: AccessTokenGuard,
    private readonly apiKey: APIKeyGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<
      AuthDecoratorPayload | undefined
    >(AUTH_KEY, [context.getHandler(), context.getClass()]) ?? {
      authKey: [AuthKey.None],
      option: { condition: ConditionKey.And },
    };

    const guards = authTypeValue.authKey.map(
      (authType) => this.authTypeGuardMap[authType],
    );

    let error = new UnauthorizedException();
    if (authTypeValue.option.condition === ConditionKey.Or) {
      for (const guard of guards) {
        const canActive = await Promise.resolve(
          guard.canActivate(context),
        ).catch((err) => {
          error = err;
          return false;
        });
        if (canActive) {
          return true;
        }
      }
      throw error;
    } else {
      for (const guard of guards) {
        const canActive = await Promise.resolve(
          guard.canActivate(context),
        ).catch((err) => {
          error = err;
          return false;
        });
        if (!canActive) {
          throw new UnauthorizedException();
        }
      }
      return true;
    }
  }
}
