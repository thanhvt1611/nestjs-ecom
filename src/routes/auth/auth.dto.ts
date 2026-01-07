import { createZodDto } from 'nestjs-zod';
import {
  Disable2FABodySchema,
  ForgotPasswordBodySchema,
  GoogleAuthUrlResSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  Setup2FAResSchema,
  VerificationBodySchema,
} from './auth.model';

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class VerificationBodyDTO extends createZodDto(VerificationBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}

export class GoogleAuthUrlResDTO extends createZodDto(GoogleAuthUrlResSchema) {}

export class ForgotPasswordBodyDTO extends createZodDto(ForgotPasswordBodySchema) {}

export class Setup2FAResDTO extends createZodDto(Setup2FAResSchema) {}

export class Disable2FABodyDTO extends createZodDto(Disable2FABodySchema) {}
