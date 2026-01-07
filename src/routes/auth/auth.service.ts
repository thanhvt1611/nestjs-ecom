import { Injectable, UnprocessableEntityException, UnauthorizedException, HttpException } from '@nestjs/common';
import { RoleService } from './role.service';
import { HashingService } from '../../shared/services/hashing.service';
import { isNotFoundError, isUniqueConstraintError, randomOTP } from '../../shared/helpers';
import {
  Disable2FABodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RegisterBodyType,
  RegisterResType,
  VerificationBodyType,
} from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from '../../shared/config';
import { TypeOfVerificationCode } from '../../shared/constants/auth';
import { EmailService } from '../../shared/services/email.service';
import { TokenService } from '../../shared/services/token.service';
import { AccessTokenCreatePayload } from '../../shared/types/token.type';
import { RefreshTokenBodyDTO } from './auth.dto';
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  InvalidPassword,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
} from './error.model';
import { TwoFactorAuthenticationService } from '../../shared/services/2fa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResType> {
    try {
      const verificationCodePayload = { email: body.email, type: TypeOfVerificationCode.REGISTER };
      await this.validateVerificationCode({ ...verificationCodePayload, code: body.code });

      const clientRoleId = await this.roleService.getClientRoleID();
      const { confirmPassword, code, ...bodyData } = body;
      const hashPassword = await this.hashingService.hashPassword(bodyData.password);

      const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
        email_type: verificationCodePayload,
      });

      const $createUser = this.authRepository.createUser({
        ...bodyData,
        password: hashPassword,
        roleId: clientRoleId,
      });

      const [, user] = await Promise.all([$deleteVerificationCode, $createUser]);

      return user;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw EmailAlreadyExistsException;
      }
      throw error;
    }
  }

  async sendOTP(body: VerificationBodyType) {
    //1. kiểm tra email đã tồn tại trong bản user hay chưa
    const user = await this.sharedUserRepository.findUnique({ email: body.email });
    if (user && body.type === TypeOfVerificationCode.REGISTER) {
      throw EmailAlreadyExistsException;
    }

    if (!user && body.type === TypeOfVerificationCode.FORGOT_PASSWORD) {
      throw EmailNotFoundException;
    }

    //2. nếu chưa tồn tại thì tạo/cập nhật mã code
    const code = randomOTP();
    const expiresInMs = ms(envConfig.OTP_EXPIRES_IN as Parameters<typeof ms>[0]);
    await this.authRepository.storeVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), expiresInMs).toISOString(),
    });

    //3. gửi mã code về email
    const { error } = this.emailService.sendOTP(body.email, code);
    if (error) {
      throw FailedToSendOTPException;
    }

    return { message: 'Verification code sent' };
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.sharedUserRepository.findUniqueUserAndRole({
      email: body.email,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    const isMatch = await this.hashingService.comparePassword(body.password, user.password);
    if (!isMatch) {
      throw InvalidPassword;
    }

    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPAndCodeException;
      }
      if (body.totpCode) {
        const isValid = this.twoFactorAuthenticationService.verifyTOTP({
          email: body.email,
          token: body.totpCode,
          secret: user.totpSecret,
        });
        if (!isValid) {
          throw InvalidTOTPException;
        }
      } else if (body.code) {
        const verificationCodePayload = { email: body.email, type: TypeOfVerificationCode.LOGIN };
        const verificationCode = await this.validateVerificationCode({ ...verificationCodePayload, code: body.code });
        if (verificationCode) {
          await this.authRepository.deleteVerificationCode({ email_type: verificationCodePayload });
        }
      }
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

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyDTO & { userAgent: string; ip: string }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

      const refreshTokenRecord = await this.authRepository.findUniqueRefreshToken({
        token: refreshToken,
      });

      if (!refreshTokenRecord) {
        throw RefreshTokenAlreadyUsedException;
      }

      const $updateDevice = this.authRepository.updateDevice(refreshTokenRecord.deviceId, {
        userAgent,
        ip,
      });

      const $deleteRefreshToken = this.authRepository.deleteRefreshToken(refreshToken);

      const $tokens = this.generateTokens({
        userId,
        roleId: refreshTokenRecord.user.roleId,
        roleName: refreshTokenRecord.user.role.name,
        deviceId: refreshTokenRecord.deviceId,
      });

      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens]);
      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);

      const refreshTokenRecord = await this.authRepository.deleteRefreshToken(refreshToken);

      await this.authRepository.updateDevice(refreshTokenRecord.deviceId, {
        isActive: false,
      });

      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw RefreshTokenAlreadyUsedException;
      }
      throw error;
    }
  }

  async forgotPassword({ email, code, newPassword }: ForgotPasswordBodyType) {
    //find user by email
    const user = await this.sharedUserRepository.findUnique({ email: email });

    if (!user) {
      throw EmailNotFoundException;
    }

    const verificationCodePayload = { email, type: TypeOfVerificationCode.FORGOT_PASSWORD };

    await this.validateVerificationCode({ ...verificationCodePayload, code });

    const hashPassword = await this.hashingService.hashPassword(newPassword);
    const $updateUser = this.authRepository.updateUser(
      { email },
      {
        password: hashPassword,
      },
    );

    const $deleteVerificationCode = this.authRepository.deleteVerificationCode({ email_type: verificationCodePayload });

    await Promise.all([$updateUser, $deleteVerificationCode]);

    return { message: 'Password changed' };
  }

  async validateVerificationCode({ email, type, code }: { email: string; type: TypeOfVerificationCode; code: string }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({ email_type: { email, type } });

    if (!verificationCode || verificationCode.code !== code) {
      throw InvalidOTPException;
    }

    if (new Date(verificationCode.expiresAt) < new Date()) {
      throw OTPExpiredException;
    }

    return verificationCode;
  }

  async setup2FA(userId: number) {
    //1. kiểm tra user có tồn tại trong db hay không, nếu có thì đã bật 2fa hay chưa(có totpSecret hay chưa)
    const user = await this.sharedUserRepository.findUniqueUserAndRole({ id: userId });
    if (!user) {
      throw EmailNotFoundException;
    }
    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException;
    }
    //2. nếu chưa bật 2fa thì tạo mới và lưu vào db
    const { secret, qrCodeUrl } = this.twoFactorAuthenticationService.generateTOTPSecret(user.email);
    await this.authRepository.updateUser(
      { id: userId },
      {
        totpSecret: secret,
      },
    );
    //3. trả về secret và qrCodeUrl
    return { secret, qrCodeUrl };
  }

  async disable2FA({ totp, code, userId }: Disable2FABodyType & { userId: number }) {
    //1. kiểm tra user có tồn tại trong db hay không, nếu có thì đã bật 2fa hay chưa(có totpSecret hay chưa)
    const user = await this.sharedUserRepository.findUniqueUserAndRole({ id: userId });
    if (!user) {
      throw EmailNotFoundException;
    }
    if (!user.totpSecret) {
      throw TOTPNotEnabledException;
    }

    //2. verify totp hoặc code
    if (totp) {
      const isValid = this.twoFactorAuthenticationService.verifyTOTP({
        email: user.email,
        token: totp,
        secret: user.totpSecret,
      });
      if (!isValid) {
        throw InvalidTOTPException;
      }
    } else if (code) {
      const verificationCodePayload = { email: user.email, code, type: TypeOfVerificationCode.DISABLE_2FA };
      await this.validateVerificationCode(verificationCodePayload);
    }

    //3. disable 2fa
    await this.authRepository.updateUser(
      { id: userId },
      {
        totpSecret: null,
      },
    );

    return { message: '2FA disabled' };
  }
}
