import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreatePermissionBodyType, GetListPermissionBodyType, UpdatePermissionBodyType } from './permission.model';
import { SerializeAll } from '../../shared/constants/serialize.decorator';

@Injectable()
@SerializeAll()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllWithPagination({ page, limit }: GetListPermissionBodyType) {
    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({ where: { deletedAt: null } }),
      this.prismaService.permission.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null },
      }),
    ]);
    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  findById(id: number) {
    return this.prismaService.permission.findUnique({
      where: { id, deletedAt: null },
    });
  }

  create({ body, createdById }: { body: CreatePermissionBodyType; createdById: number }) {
    return this.prismaService.permission.create({
      data: { ...body, createdById },
    });
  }

  update({ id, ...payload }: { id: number; updatedById: number } & UpdatePermissionBodyType) {
    return this.prismaService.permission.update({ data: payload, where: { id, deletedAt: null } });
  }

  delete({ id, deletedById, isForceDelete }: { id: number; deletedById: number; isForceDelete?: boolean }) {
    return isForceDelete
      ? this.prismaService.permission.delete({ where: { id } })
      : this.prismaService.permission.update({
          data: { deletedAt: new Date(), deletedById },
          where: { id, deletedAt: null },
        });
  }
}
