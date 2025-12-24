import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import z from 'zod';

config({
  path: '.env',
});

//kiểm tra đã tồn tại file .env hay chưa
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Vui lòng tạo file .env');
  process.exit(1);
}

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_API_KEY: z.string(),
  PORT: z.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error('Các giá trị trong file .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
