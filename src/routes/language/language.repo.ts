import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateLanguageBodyType, GetLanguageBodyType, UpdateLanguageBodyType } from './language.model';
import { SerializeAll } from '../../shared/constants/serialize.decorator';

@Injectable()
@SerializeAll()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  getOne(id: string) {
    return this.prismaService.language.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  create(payload: CreateLanguageBodyType & { createdById: number }) {
    return this.prismaService.language.create({
      data: { id: payload.code, name: payload.name, createdById: payload.createdById },
    });
  }

  update({ id, ...payload }: { id: string; updatedById: number } & UpdateLanguageBodyType) {
    return this.prismaService.language.update({ data: payload, where: { id, deletedAt: null } });
  }

  delete({ id, isForceDelete }: { id: string; isForceDelete: boolean }) {
    return isForceDelete
      ? this.prismaService.language.delete({ where: { id } })
      : this.prismaService.language.update({ data: { deletedAt: new Date() }, where: { id, deletedAt: null } });
  }
}
