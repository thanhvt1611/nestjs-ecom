import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import envConfig from '../../shared/config';
import { GoogleAuthUrlType } from './auth.model';
import { OAuth2Client } from 'google-auth-library';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';
import { RoleService } from './role.service';
import { HashingService } from '../../shared/services/hashing.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleService {
  private googleAuth: OAuth2Client;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authService: AuthService,
  ) {
    this.googleAuth = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI,
    );
  }

  getGoogleAuthUrl({ userAgent, ip }: GoogleAuthUrlType) {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const stateStr = Buffer.from(JSON.stringify({ userAgent, ip })).toString('base64');
    const url = this.googleAuth.generateAuthUrl({ scope, state: stateStr, access_type: 'offline', prompt: 'consent' });
    return { url };
  }

  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'unknown';
      let ip = 'unknown';
      try {
        const stateObj = JSON.parse(Buffer.from(state, 'base64').toString('utf8')) as GoogleAuthUrlType;
        userAgent = stateObj.userAgent;
        ip = stateObj.ip;
      } catch (error) {
        console.error('Parsing state error', error);
      }

      const { tokens } = await this.googleAuth.getToken(code);
      this.googleAuth.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: this.googleAuth,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email) {
        throw new Error('Cannot get email from Google');
      }

      let user = await this.sharedUserRepository.findUniqueUserAndRole({ email: data.email });

      if (!user) {
        const clientRoleId = await this.roleService.getClientRoleID();
        const hashPassword = await this.hashingService.hashPassword(crypto.randomUUID());
        user = await this.authRepository.createUserIncludeRole({
          email: data.email,
          name: data.name ?? '',
          phoneNumber: '',
          password: hashPassword,
          roleId: clientRoleId,
          avatar: data.picture ?? '',
        });
      }

      const device = await this.authRepository.createDevice({
        userId: user.id,
        userAgent: userAgent,
        ip: ip,
      });

      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        roleId: user.roleId,
        roleName: user.role.name,
        deviceId: device.id,
      });

      return authTokens;
    } catch (error) {
      console.error('Google callback error', error);
      throw error;
    }
  }
}
