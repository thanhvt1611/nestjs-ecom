export interface AccessTokenCreatePayload {
  userId: number;
  roleId: number;
  roleName: string;
  deviceId: number;
}

export interface AccessTokenPayload extends AccessTokenCreatePayload {
  exp: number;
  iat: number;
}

export interface RefreshTokenCreatePayload {
  userId: number;
}

export interface RefreshTokenPayload extends RefreshTokenCreatePayload {
  exp: number;
  iat: number;
}
