import z from 'zod';

// khi extend có thể dùng .omit({}) để loại bỏ strict mode
export const GetListBodySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export type GetListBodyType = z.infer<typeof GetListBodySchema>;

export const GetOneBodySchema = z.object({ id: z.coerce.number().int().positive() }).strict();

export type GetOneBodyType = z.infer<typeof GetOneBodySchema>;
