import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';

@Injectable()
export class EmailService {
  private resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }
  sendOTP(email: string, code: string) {
    return this.resend.emails.send({
      from: `Nestjs Ecommerce <no-reply@${envConfig.EMAIL_DOMAIN}>`,
      to: email,
      subject: 'Your verification code',
      html: `<p>Your verification code is <strong>${code}</strong></p>`,
    });
  }
}
