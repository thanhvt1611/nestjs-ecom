import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  GetListPermissionBodySchema,
  GetListPermissionsResSchema,
  PermissionSchema,
  UpdatePermissionBodySchema,
} from './permission.model';
import { GetOneBodySchema } from '../../shared/models/base.model';

export class CreatePermissionDTO extends createZodDto(CreatePermissionBodySchema) {}

export class UpdatePermissionDTO extends createZodDto(UpdatePermissionBodySchema) {}

export class GetPermissionBodyDTO extends createZodDto(GetOneBodySchema) {}

export class GetPermissionResDTO extends createZodDto(PermissionSchema) {}

export class GetListPermissionBodyDTO extends createZodDto(GetListPermissionBodySchema) {}

export class GetListPermissionsResDTO extends createZodDto(GetListPermissionsResSchema) {}
