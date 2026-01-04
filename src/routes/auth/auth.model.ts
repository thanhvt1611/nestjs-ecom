import z from 'zod';
import { TypeOfVerificationCode } from '../../shared/constants/auth';
import { UserSchema } from '../../shared/models/shared-user.model';

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  password: true,
})
  .extend({
    confirmPassword: z.string(),
    code: z.string().length(6),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type RegisterResType = z.infer<typeof RegisterResSchema>;

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(TypeOfVerificationCode),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export const VerificationBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
});

export type VerificationBodyType = z.infer<typeof VerificationBodySchema>;

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginBodyType = z.infer<typeof LoginBodySchema>;

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResType = z.infer<typeof LoginResSchema>;

export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;

export const RefreshTokenResSchema = LoginResSchema;

export type RefreshTokenResType = LoginResType;

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  isActive: z.boolean(),
});

export type DeviceType = z.infer<typeof DeviceSchema>;

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type RoleType = z.infer<typeof RoleSchema>;

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;

export const LogoutBodySchema = RefreshTokenBodySchema;

export type LogoutBodyType = RefreshTokenBodyType;

export const GoogleAuthUrlSchema = z.object({
  userAgent: z.string(),
  ip: z.string(),
});

export type GoogleAuthUrlType = z.infer<typeof GoogleAuthUrlSchema>;

export const GoogleAuthUrlResSchema = z.object({
  url: z.string(),
});

export type GoogleAuthUrlResType = z.infer<typeof GoogleAuthUrlResSchema>;
