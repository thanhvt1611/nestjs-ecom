import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GoogleAuthUrlResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  VerificationBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { RealIp } from '../../shared/decorators/real-ip.decorator';
import { MessageResDTO } from '../../shared/dtos/respose.dto';
import { IsPublic } from '../../shared/decorators/auth.decorator';
import { PublicGet, PublicPost } from '../../shared/decorators/public-route.decorator';
import { GoogleService } from './google.service';
import { Response } from 'express';
import envConfig from '../../shared/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @PublicGet('register')
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @PublicPost('otp')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: VerificationBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @PublicPost('login')
  @ZodSerializerDto(LoginResDTO)
  login(@Body() body: LoginBodyDTO, @Headers('User-Agent') userAgent: string, @RealIp() ip: string) {
    return this.authService.login({ ...body, userAgent, ip });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(@Body() body: RefreshTokenBodyDTO, @Headers('User-Agent') userAgent: string, @RealIp() ip: string) {
    return this.authService.refreshToken({ ...body, userAgent, ip });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken);
  }

  @PublicGet('google-link')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(GoogleAuthUrlResDTO)
  getAuthorizationUrl(@Headers('User-Agent') userAgent: string, @RealIp() ip: string) {
    return this.googleService.getGoogleAuthUrl({ userAgent, ip });
  }

  @PublicGet('google/callback')
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({ code, state });
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong';
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${msg}`);
    }
  }
}
