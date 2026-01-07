import z from 'zod';

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
});

export type LanguageType = z.infer<typeof LanguageSchema>;

export const GetLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number(),
});

export type GetLanguagesResType = z.infer<typeof GetLanguagesResSchema>;

export const GetLanguageBodySchema = LanguageSchema.pick({ id: true }).strict();

export type GetLanguageBodyType = z.infer<typeof GetLanguageBodySchema>;

export const CreateLanguageBodySchema = LanguageSchema.pick({ name: true }).extend({ code: z.string() }).strict();

export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>;

export const UpdateLanguageBodySchema = LanguageSchema.pick({ name: true }).strict();

export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>;
