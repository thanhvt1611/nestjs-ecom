import z from 'zod';
import { PermissionMethod } from '../../shared/constants/permission';
import { GetListBodySchema, GetOneBodySchema } from '../../shared/models/base.model';

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().nonempty({ message: 'Name is required' }),
  description: z.string(),
  path: z.string().nonempty({ message: 'Path is required' }),
  method: z.enum([
    PermissionMethod.GET,
    PermissionMethod.POST,
    PermissionMethod.PUT,
    PermissionMethod.DELETE,
    PermissionMethod.PATCH,
    PermissionMethod.OPTIONS,
    PermissionMethod.HEAD,
  ]),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type PermissionType = z.infer<typeof PermissionSchema>;

export const GetListPermissionBodySchema = GetListBodySchema;

export type GetListPermissionBodyType = z.infer<typeof GetListPermissionBodySchema>;

export const GetListPermissionsResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type GetListPermissionsResType = z.infer<typeof GetListPermissionsResSchema>;

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  description: true,
  path: true,
  method: true,
}).strict();

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;

export const UpdatePermissionBodySchema = CreatePermissionBodySchema.partial().strict();

export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;
