import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { RoleName } from '../src/shared/constants/user';
import envConfig from '../src/shared/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: envConfig.DATABASE_URL,
  }),
});
//kiểm tra bảng role và user, nếu chưa có thì tạo role trước sau đó tạo user cho các role
async function main() {
  try {
    const roles = await prisma.role.count();
    if (roles > 0) {
      throw new Error('Role already exists');
    }
    const { count: createdRoles } = await prisma.role.createMany({
      data: [
        { name: RoleName.Admin, description: 'Quản trị viên' },
        { name: RoleName.Client, description: 'Khách hàng' },
        { name: RoleName.Seller, description: 'Nhân viên bán hàng' },
      ],
    });

    //get roleId of admin
    const adminRoleId = await prisma.role.findUniqueOrThrow({
      where: {
        name: RoleName.Admin,
      },
      select: {
        id: true,
      },
    });
    const user = await prisma.user.findFirstOrThrow({
      where: {
        roleId: adminRoleId.id,
      },
    });

    if (user) {
      throw new Error('User already exists');
    }

    const hashPassword = bcrypt.hashSync('password@123', 10);
    const userAdmin = await prisma.user.create({
      data: {
        email: 'thanhvt1611@gmail.com',
        name: 'Vũ Tiến Thành',
        password: hashPassword,
        roleId: adminRoleId.id,
        phoneNumber: '0909090909',
      },
    });
    return {
      createdRoles,
      userAdmin,
    };
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((data) => {
    console.log('Created roles: ', data?.createdRoles);
    console.log('Created user admin: ', data?.userAdmin);
  })
  .catch((error) => console.error(error));
