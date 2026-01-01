import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  VerificationBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { RealIp } from '../../shared/decorators/real-ip.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('otp')
  sendOTP(@Body() body: VerificationBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('login')
  @ZodSerializerDto(LoginResDTO)
  async login(@Body() body: LoginBodyDTO, @Headers('User-Agent') userAgent: string, @RealIp() ip: string) {
    return await this.authService.login({ ...body, userAgent, ip });
  }

  // @Post('refresh-token')
  // @HttpCode(HttpStatus.OK)
  // @ZodSerializerDto(RefreshTokenResDTO)
  // async refreshToken(@Body() body: RefreshTokenBodyDTO) {
  //   return await this.authService.refreshToken(body.refreshToken);
  // }

  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Body() body: LogoutBodyDTO) {
  //   return new LogoutResDTO(await this.authService.logout(body.refreshToken));
  // }
}
