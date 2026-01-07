import { Prisma } from '../generated/prisma/client';

export const isUniqueConstraintError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

export const isNotFoundError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
};

export const randomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

type DateToString<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? Array<DateToString<U>>
    : T extends object
      ? { [K in keyof T]: DateToString<T[K]> }
      : T;

export function convertDatesToISO<T>(obj: T): DateToString<T> {
  if (obj === null || obj === undefined) {
    return obj as any;
  }

  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToISO(item)) as any;
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertDatesToISO((obj as any)[key]);
      }
    }
    return result;
  }

  return obj as any;
}
