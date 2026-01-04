import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình trust proxy để lấy IP chính xác từ reverse proxy
  // Điều này cho phép Express đọc X-Forwarded-* headers
  // Trong production, nên set giá trị cụ thể (số hop hoặc subnet)
  // Ví dụ: app.set('trust proxy', 1) - trust proxy đầu tiên
  // Hoặc: app.set('trust proxy', 'loopback, linklocal, uniquelocal')
  app.set('trust proxy', true);

  app.enableCors({
    origin: 'http://localhost:3300',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
