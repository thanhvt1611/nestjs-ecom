import { Injectable, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { RoleService } from './role.service';
import { HashingService } from '../../shared/services/hashing.service';
import { isUniqueConstraintError, randomOTP } from '../../shared/helpers';
import { LoginBodyType, RegisterBodyType, RegisterResType, VerificationBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from '../../shared/config';
import { TypeOfVerificationCode } from '../../shared/constants/auth';
import { EmailService } from '../../shared/services/email.service';
import { TokenService } from '../../shared/services/token.service';
import { AccessTokenCreatePayload } from '../../shared/types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResType> {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER,
      });

      if (!verificationCode) {
        throw new UnprocessableEntityException({
          path: 'code',
          message: 'Invalid verification code',
        });
      }

      if (new Date(verificationCode.expiresAt) < new Date()) {
        throw new UnprocessableEntityException({
          path: 'code',
          message: 'Verification code expired',
        });
      }

      const clientRoleId = await this.roleService.getClientRoleID();
      const { confirmPassword, code, ...bodyData } = body;
      const hashPassword = await this.hashingService.hashPassword(bodyData.password);
      return await this.authRepository.createUser({
        ...bodyData,
        password: hashPassword,
        roleId: clientRoleId,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new UnprocessableEntityException({
          path: 'email',
          message: 'Email already exists',
        });
      }
      throw error;
    }
  }

  async sendOTP(body: VerificationBodyType) {
    //1. kiểm tra email đã tồn tại trong bản user hay chưa
    const user = await this.sharedUserRepository.findUnique({ email: body.email });
    if (user) {
      throw new UnprocessableEntityException({
        path: 'email',
        message: 'Email already exists',
      });
    }

    //2. nếu chưa tồn tại thì tạo/cập nhật mã code
    const code = randomOTP();
    const expiresInMs = ms(envConfig.OTP_EXPIRES_IN as Parameters<typeof ms>[0]);
    const verificationCode = await this.authRepository.storeVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), expiresInMs).toISOString(),
    });

    //3. gửi mã code về email
    const { error } = this.emailService.sendOTP(body.email, code);
    if (error) {
      throw new UnprocessableEntityException({
        path: 'code',
        message: 'Failed to send verification code',
      });
    }

    return verificationCode;
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (!user) {
      throw new UnprocessableEntityException({
        field: 'email',
        error: 'Email is not registered',
      });
    }

    const isMatch = await this.hashingService.comparePassword(body.password, user.password);
    if (!isMatch) {
      throw new UnprocessableEntityException({
        field: 'password',
        error: 'Password is incorrect',
      });
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });

    const tokens = await this.generateTokens({
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      deviceId: device.id,
    });

    return tokens;
  }

  async generateTokens({ userId, roleId, roleName, deviceId }: AccessTokenCreatePayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId, roleId, roleName, deviceId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    const refreshTokenDecode = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authRepository.createRefreshToken({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(refreshTokenDecode.exp * 1000).toISOString(),
        deviceId,
      },
    });

    return { accessToken, refreshToken };
  }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     const refreshTokenRecord = await this.prisma.refreshToken.findFirstOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     await this.prisma.refreshToken.delete({
  //       where: {
  //         id: refreshTokenRecord.id,
  //       },
  //     });

  //     const refreshTokenDecode = await this.tokenService.verifyRefreshToken(refreshToken);
  //     const userId = refreshTokenDecode.userId;
  //     const tokens = await this.generateTokens(userId);
  //     return tokens;
  //   } catch (error) {
  //     if (isNotFoundError(error)) {
  //       throw new UnauthorizedException('Invalid refresh token');
  //     }
  //     throw error;
  //   }
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     const refreshTokenRecord = await this.prisma.refreshToken.findFirstOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     await this.prisma.refreshToken.delete({
  //       where: {
  //         id: refreshTokenRecord.id,
  //       },
  //     });

  //     return { message: 'Logout successfully' };
  //   } catch (error) {
  //     if (isNotFoundError(error)) {
  //       throw new UnauthorizedException('Invalid refresh token');
  //     }
  //     throw error;
  //   }
  // }
}
