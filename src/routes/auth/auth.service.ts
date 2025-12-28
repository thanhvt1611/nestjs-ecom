import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RoleService } from './role.service';
import { HashingService } from '../../shared/services/hashing.service';
import { isUniqueConstraintError, randomOTP } from '../../shared/helpers';
import { RegisterBodyType, RegisterResType, VerificationBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import envConfig from '../../shared/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResType> {
    try {
      const clientRoleId = await this.roleService.getClientRoleID();
      const { confirmPassword, ...bodyData } = body;
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
    return verificationCode;
  }
}
