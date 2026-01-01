import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { SerializeAll } from '../../shared/constants/serialize.decorator';
import { UserType } from '../../shared/models/shared-user.model';
import { DeviceType, RefreshTokenType, VerificationCodeType } from './auth.model';
import { TypeOfVerificationCode } from '../../shared/constants/auth';

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

  storeVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
      create: payload,
    }) as any;
  }

  findUniqueVerificationCode(
    payload: { email: string } | { code: string } | { email: string; code: string; type: TypeOfVerificationCode },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: payload,
    }) as any;
  }

  createRefreshToken(payload: { data: Omit<RefreshTokenType, 'createdAt'> }) {
    return this.prismaService.refreshToken.create(payload);
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'isActive' | 'lastActive'>>,
  ) {
    return this.prismaService.device.create({ data });
  }
}
