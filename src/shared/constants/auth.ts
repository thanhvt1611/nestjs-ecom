export const USER_KEY = 'user';

export const AUTH_KEY = 'auth';

export const AuthKey = {
  Bearer: 'Bearer',
  APIKey: 'APIKey',
  None: 'None',
} as const;

export type AuthKeyType = (typeof AuthKey)[keyof typeof AuthKey];

export const ConditionKey = {
  And: 'And',
  Or: 'Or',
} as const;

export type ConditionKeyType = (typeof ConditionKey)[keyof typeof ConditionKey];

export type AuthDecoratorPayload = {
  authKey: AuthKeyType[];
  option: { condition: ConditionKeyType };
};

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const TypeOfVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
} as const;

export type TypeOfVerificationCode = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode];
