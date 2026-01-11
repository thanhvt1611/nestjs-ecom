// Source - https://stackoverflow.com/a
// Posted by oviniciusfeitosa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-11, License - CC BY-SA 4.0

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import envConfig from '../src/shared/config';
import { PermissionMethodType } from '../src/shared/constants/permission';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: envConfig.DATABASE_URL,
  }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  //lấy danh sách permission đã tồn tại
  const existingPermissions = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  //tạo object với key = path + method, value là item trong existingPermissions
  const existingPermissionsMap: Record<string, (typeof existingPermissions)[0]> = existingPermissions.reduce(
    (acc, item) => {
      acc[`${item.path}-${item.method}`] = item;
      return acc;
    },
    {},
  );

  const availableRoutes: { path: string; method: PermissionMethodType; name: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = String(layer.route?.stack[0].method).toUpperCase() as PermissionMethodType;
        return {
          path,
          method,
          name: path + ' ' + method,
        };
      }
    })
    .filter((item) => item !== undefined);

  //tạo object với key = path + method, value là item trong availableRoutes
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.path}-${item.method}`] = item;
    return acc;
  }, {});
  //xóa các item có trong existingPermissionsMap nhưng không có trong availableRoutesMap
  const permissionsToDelete = Object.keys(existingPermissionsMap).filter((key) => !availableRoutesMap[key]);
  if (permissionsToDelete.length > 0) {
    const deletedPermissions = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((key) => existingPermissionsMap[key].id),
        },
      },
    });
    console.log('Deleted permissions: ', deletedPermissions.count);
  } else {
    console.log('No permissions to delete');
  }

  //thêm các item có trong availableRoutesMap nhưng không có trong existingPermissionsMap
  const permissionsToCreate = Object.keys(availableRoutesMap).filter((key) => !existingPermissionsMap[key]);
  if (permissionsToCreate.length > 0) {
    const createdPermissions = await prisma.permission.createMany({
      data: permissionsToCreate.map((key) => ({
        ...availableRoutesMap[key],
        description: availableRoutesMap[key].name,
      })),
    });
    console.log('Created permissions: ', createdPermissions.count);
  } else {
    console.log('No permissions to create');
  }

  process.exit(0);
}
bootstrap();
