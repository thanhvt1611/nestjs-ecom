import { ConflictException, Injectable } from '@nestjs/common';
import { RoleService } from './role.service';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { isUniqueConstraintError } from '../../shared/helpers';
import { RegisterBodyDTO, UserType } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
  ) {}

  async register(body: RegisterBodyDTO): Promise<UserType> {
    try {
      const clientRoleId = await this.roleService.getClientRoleID();
      const { confirmPassword, ...bodyData } = body;
      const hashPassword = await this.hashingService.hashPassword(
        bodyData.password,
      );
      const user = await this.prismaService.user.create({
        data: {
          ...bodyData,
          password: hashPassword,
          roleId: clientRoleId,
        },
        omit: {
          password: true,
          totpSecret: true,
        },
      });

      return user as any;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
