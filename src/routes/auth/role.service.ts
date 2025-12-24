import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { RoleName } from '../../shared/constants/user';

@Injectable()
export class RoleService {
  private clientRoleId: number;
  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleID() {
    if (this.clientRoleId) {
      return this.clientRoleId;
    }
    const clientRole = await this.prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client,
      },
      select: {
        id: true,
      },
    });
    this.clientRoleId = clientRole.id;
    return this.clientRoleId;
  }
}
