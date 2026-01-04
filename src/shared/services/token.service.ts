import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import envConfig from '../config';
import {
  AccessTokenCreatePayload,
  AccessTokenPayload,
  RefreshTokenCreatePayload,
  RefreshTokenPayload,
} from '../types/token.type';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  signAccessToken(payload: AccessTokenCreatePayload) {
    return this.jwtService.signAsync({ ...payload, uuid: crypto.randomUUID() }, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
      algorithm: 'HS256',
    } as JwtSignOptions);
  }

  signRefreshToken(payload: RefreshTokenCreatePayload) {
    return this.jwtService.signAsync({ ...payload, uuid: crypto.randomUUID() }, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
      algorithm: 'HS256',
    } as JwtSignOptions);
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
}
