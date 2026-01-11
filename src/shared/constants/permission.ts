export const PermissionMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export type PermissionMethodType = (typeof PermissionMethod)[keyof typeof PermissionMethod];
