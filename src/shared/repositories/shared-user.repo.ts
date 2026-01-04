import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(unique: { email: string } | { id: number }) {
    return this.prismaService.user.findUnique({
      where: unique,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  findUniqueUserAndRole(unique: { email: string } | { id: number }) {
    return this.prismaService.user.findUnique({
      where: unique,
      include: {
        role: true,
      },
    });
  }
}
