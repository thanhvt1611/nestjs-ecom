import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/services/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async getHello(): Promise<string> {
    console.log(await this.prisma.user.findMany());
    return Promise.resolve('Hello World!');
  }
}
