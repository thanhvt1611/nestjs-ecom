import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
