import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import fs from 'fs';
import path from 'path';
import { OTPEmail } from 'emails/otp';
import * as React from 'react';

@Injectable()
export class EmailService {
  private resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }
  sendOTP(email: string, code: string) {
    const emailTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/otp.html'), 'utf8');
    const subject = 'Your verification code';
    const html = emailTemplate.replace('{{code}}', code).replace('{{subject}}', subject);
    return this.resend.emails.send({
      from: `Nestjs Ecommerce <no-reply@${envConfig.EMAIL_DOMAIN}>`,
      to: email,
      subject,
      react: <OTPEmail otpCode={code} title={subject} />,
      // html,
    });
  }
}
