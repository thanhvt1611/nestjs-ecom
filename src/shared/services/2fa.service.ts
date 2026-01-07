import { Injectable } from '@nestjs/common';
import * as OTPAuth from 'otpauth';
import envConfig from '../config';

@Injectable()
export class TwoFactorAuthenticationService {
  private createAuthOTP(email: string, secret?: string) {
    return new OTPAuth.TOTP({
      issuer: envConfig.APP_NAME,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret ?? new OTPAuth.Secret(),
    });
  }

  generateTOTPSecret(email: string) {
    const auth = this.createAuthOTP(email);
    return {
      secret: auth.secret.base32,
      qrCodeUrl: auth.toString(),
    };
  }

  verifyTOTP({ email, token, secret }: { email: string; token: string; secret: string }) {
    const auth = this.createAuthOTP(email, secret);

    const delta = auth.validate({ token, window: 1 });

    return delta !== null;
  }
}
