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
