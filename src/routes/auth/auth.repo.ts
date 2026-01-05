import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { SerializeAll } from '../../shared/constants/serialize.decorator';
import { UserType } from '../../shared/models/shared-user.model';
import { DeviceType, RefreshTokenType, RoleType, VerificationCodeType } from './auth.model';
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
        type: payload.type,
      },
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
        type: payload.type,
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

  findUniqueRefreshToken(uniqeObj: { token: string }) {
    return this.prismaService.refreshToken.findUnique({
      where: uniqeObj,
      include: {
        device: true,
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>) {
    return this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data,
    });
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  createUserIncludeRole(user: Pick<UserType, 'email' | 'name' | 'phoneNumber' | 'password' | 'roleId' | 'avatar'>) {
    return this.prismaService.user.create({
      data: user,
      include: {
        role: true,
      },
    });
  }

  updateUser(where: { email: string } | { id: number }, data: Partial<Omit<UserType, 'id'>>) {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  deleteVerificationCode(
    uniqueObj: { email: string } | { code: string } | { email: string; code: string; type: TypeOfVerificationCode },
  ) {
    return this.prismaService.verificationCode.delete({
      where: uniqueObj,
    });
  }
}
