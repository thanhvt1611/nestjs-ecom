import { Injectable } from '@nestjs/common';
import { CreatePermissionBodyType, GetListPermissionBodyType, UpdatePermissionBodyType } from './permission.model';
import { PermissionRepository } from './permission.repo';
import { NotFoundRecordException } from '../../shared/error';
import { isNotFoundError, isUniqueConstraintError } from '../../shared/helpers';
import { PermissionAlreadyExistsException } from './permission.error';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create({ body, userId }: { body: CreatePermissionBodyType; userId: number }) {
    try {
      return await this.permissionRepository.create({ body, createdById: userId });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw PermissionAlreadyExistsException;
      }
      throw error;
    }
  }

  async findAll({ page, limit }: GetListPermissionBodyType) {
    const { data, totalItems, totalPages } = await this.permissionRepository.findAllWithPagination({
      page,
      limit,
    });
    return { data, totalItems, totalPages, page, limit };
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw NotFoundRecordException;
    }
    return permission;
  }

  async update({ id, body, userId }: { id: number; body: UpdatePermissionBodyType; userId: number }) {
    try {
      return await this.permissionRepository.update({ id, ...body, updatedById: userId });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstraintError(error)) {
        throw PermissionAlreadyExistsException;
      }
      throw error;
    }
  }

  async remove({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.permissionRepository.delete({ id, deletedById });
      return { message: 'OK' };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
