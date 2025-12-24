import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { USER_KEY } from '../constants/auth';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const validateRequest = async (request: any) => {
      const authHeader: string = request.headers.authorization;

      try {
        const token: string = authHeader.split(' ')[1];
        if (!token) {
          throw new UnauthorizedException();
        }

        const verifyToken = await this.tokenService.verifyAccessToken(token);
        request[USER_KEY] = verifyToken;

        return true;
      } catch {
        throw new UnauthorizedException();
      }
    };
    return validateRequest(request);
  }
}
