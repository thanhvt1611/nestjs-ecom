import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import envConfig from '../config';

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const validateRequest = (request: any) => {
      const apiKey: string = request.headers['x-api-key'];

      return apiKey === envConfig.SECRET_API_KEY;
    };
    return validateRequest(request);
  }
}
