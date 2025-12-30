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
