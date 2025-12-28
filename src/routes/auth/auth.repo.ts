import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { SerializeAll } from '../../shared/constants/serialize.decorator';
import { UserType } from '../../shared/models/shared-user.model';
import { VerificationCodeType } from './auth.model';

@Injectable()
@SerializeAll()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(
    user: Pick<UserType, 'email' | 'name' | 'phoneNumber' | 'password' | 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any;
  }

  async storeVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    const find = await this.prismaService.verificationCode.findFirst({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
      },
    });
    if (find) {
      return this.prismaService.verificationCode.update({
        where: {
          id: find.id,
        },
        data: {
          code: payload.code,
          expiresAt: payload.expiresAt,
        },
      }) as any;
    }
    return this.prismaService.verificationCode.create({
      data: payload,
    }) as any;
  }
}
