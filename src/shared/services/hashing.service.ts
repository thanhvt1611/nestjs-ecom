import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class HashingService {
  async hashPassword(password: string) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}
