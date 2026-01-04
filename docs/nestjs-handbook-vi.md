# Cẩm Nang NestJS – Học Cách Sử Dụng Nest Với Các Ví Dụ Code

**Tác giả:** German Cocca  
**Ngày xuất bản:** 13 tháng 6, 2025

---

## Giới thiệu

NestJS là một framework Node.js tiến bộ để xây dựng các ứng dụng server-side hiệu quả, đáng tin cậy và có khả năng mở rộng. Kết hợp những ý tưởng tốt nhất từ OOP (Lập trình Hướng đối tượng), FP (Lập trình Hàm) và FRP (Lập trình Phản ứng Hàm), nó cung cấp cho bạn một nền tảng được kiến trúc đầy đủ, tích hợp sẵn trên Express (hoặc Fastify).

Nếu bạn đến từ Angular, bạn sẽ cảm thấy quen thuộc với cấu trúc module/controller/service và hệ thống dependency injection mạnh mẽ của nó.

Trong bài viết này, chúng ta sẽ đề cập cả lý thuyết – tại sao NestJS tồn tại, nó được cấu trúc như thế nào và khi nào nên sử dụng nó – và thực hành, với các đoạn code ngắn gọn minh họa cách khởi tạo dự án, định nghĩa routes, inject dependencies và nhiều hơn nữa.

---

## Mục lục

1. **NestJS là gì?**
   - 1.1 Lịch sử và Triết lý

2. **Tại sao chọn NestJS?**
   - 2.1 Lợi ích và Trường hợp Sử dụng
   - 2.2 So sánh với các Framework khác

3. **Bắt đầu**
   - 3.1 Cài đặt CLI
   - 3.2 Tạo Dự án Đầu tiên
   - 3.3 Tổng quan Cấu trúc Dự án

4. **Các Khối Xây dựng Cốt lõi của NestJS**
   - 4.1 Modules
   - 4.2 Controllers
   - 4.3 Providers (Services)

5. **Dependency Injection**
   - 5.1 DI hoạt động như thế nào trong NestJS
   - 5.2 Custom Providers và Factory Providers

6. **Routing & Middleware**
   - 6.1 Định nghĩa Routes
   - 6.2 Áp dụng Middleware

7. **Request Lifecycle & Pipes**
   - 7.1 Pipes là gì?
   - 7.2 Built-In vs. Custom Pipes

8. **Guards & Authorization**
   - 8.1 Triển khai Guards
   - 8.2 Role-Based Access Control

9. **Exception Filters**
   - 9.1 Xử lý Lỗi một cách Tinh tế
   - 9.2 Tạo Custom Filters

10. **Interceptors & Logging**
    - 10.1 Chuyển đổi Responses
    - 10.2 Logging và Performance Metrics

11. **Tích hợp Database**
    - 11.1 TypeORM với NestJS
    - 11.2 Mongoose (MongoDB)
    - 11.3 Prisma

12. **Quản lý Configuration**
    - 12.1 Module @nestjs/config
    - 12.2 Environment Variables

13. **Authentication**
    - 13.1 JWT Strategy
    - 13.2 OAuth2 / Social Login

14. **Kết luận & Tài nguyên Bổ sung**
    - Tóm tắt
    - Tài liệu Chính thức và Liên kết Cộng đồng

---

## 1. NestJS là gì?

NestJS là một framework để xây dựng các ứng dụng server-side trong Node.js. Nó được viết bằng TypeScript (nhưng cũng hỗ trợ JavaScript thuần). Về cốt lõi, nó:

- Bao bọc một thư viện HTTP server trưởng thành (Express hoặc Fastify)
- Chuẩn hóa kiến trúc ứng dụng xung quanh modules, controllers và providers
- Tận dụng hệ thống type của TypeScript để đảm bảo an toàn tại thời điểm compile và APIs rõ ràng
- Cung cấp hỗ trợ tích hợp sẵn cho các thứ như validation, configuration và testing

Thay vì phải tự tay kết nối các middleware, NestJS khuyến khích một cách tiếp cận khai báo, phân lớp. Bạn định nghĩa modules để nhóm các chức năng liên quan, controllers để xử lý các request đến, và providers (thường được gọi là "services") cho business logic của bạn. Đằng sau hậu trường, NestJS giải quyết các dependencies thông qua một IoC container, vì vậy bạn có thể tập trung vào việc viết các class sạch, có thể tái sử dụng.

Để khởi động một dự án, chạy các lệnh sau:

```bash
# Cài đặt Nest CLI globally
npm install -g @nestjs/cli

# Tạo một dự án mới có tên 'my-app'
nest new my-app

cd my-app
npm run start:dev
```

Khi nó đang chạy, bạn có một HTTP server sẵn sàng với hot reloading, strict typing và một layout thư mục hợp lý.

### 1.1 Lịch sử và Triết lý

NestJS lần đầu xuất hiện vào năm 2017, được tạo bởi Kamil Myśliwiec. Mục tiêu của nó là mang các mẫu kiến trúc của Angular vào thế giới backend, cung cấp:

- **Tính nhất quán:** Một cách duy nhất, có quan điểm để cấu trúc ứng dụng.
- **Khả năng mở rộng:** Các ranh giới rõ ràng (modules) giúp dễ dàng phát triển teams và codebases.
- **Khả năng kiểm thử:** Hỗ trợ tích hợp sẵn cho Jest và sự tách biệt rõ ràng các mối quan tâm.
- **Khả năng mở rộng:** Một hệ thống module có thể cắm được giúp dễ dàng tích hợp ORMs, WebSockets, GraphQL, microservices và nhiều hơn nữa.

Bên dưới, NestJS tuân theo các nguyên tắc sau:

- **Tính module hóa:** Mọi thứ đều tồn tại trong một module (AppModule, UsersModule, v.v.), có thể import các modules khác hoặc export providers.
- **Dependency Injection:** Services có thể được inject vào controllers (và thậm chí vào các services khác), điều này thúc đẩy sự kết nối lỏng lẻo.
- **Decorators và Metadata:** Với các decorators TypeScript (@Module(), @Controller(), @Injectable()), NestJS đọc metadata tại runtime để kết nối mọi thứ lại với nhau.

Đây là một ví dụ nhỏ cho thấy sự tương tác của các phần này:

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'Alice' }];
  findAll() {
    return this.users;
  }
}

// users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }
}

// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

- Decorator `@Module` nhóm controller + service
- Controller inject service thông qua constructor của nó
- Một route GET `/users` đơn giản trả về một mảng các đối tượng user

---

## 2. Tại sao chọn NestJS?

NestJS không chỉ là một framework Node.js khác – nó mang đến một cách tiếp cận có cấu trúc, cấp doanh nghiệp để xây dựng các dịch vụ backend. Trong phần này, chúng ta sẽ đề cập đến các lợi ích và trường hợp sử dụng thực tế, sau đó so sánh NestJS với các framework Node phổ biến khác để bạn có thể thấy nó phù hợp nhất ở đâu.

### 2.1 Lợi ích và Trường hợp Sử dụng

**Các mẫu kiến trúc mạnh mẽ:**

- **Tính module hóa:** Bạn chia ứng dụng của mình thành các modules tập trung (AuthModule, ProductsModule, v.v.), mỗi module chịu trách nhiệm cho một phần chức năng.
- **Tách biệt các mối quan tâm:** Controllers xử lý HTTP, services đóng gói business logic, modules kết nối mọi thứ lại.
- **Khả năng mở rộng:** Các teams đang phát triển ánh xạ tự nhiên vào các modules—các tính năng mới hiếm khi chạm vào code hiện có.

**Dependency injection (DI) tích hợp sẵn:**

- DI làm cho việc testing và hoán đổi implementations trở nên đơn giản.
- Bạn có thể dễ dàng mock một service trong unit test:

```typescript
// products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockService = { findAll: () => ['apple', 'banana'] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('returns a list of products', () => {
    expect(controller.getAll()).toEqual(['apple', 'banana']);
  });
});
```

**TypeScript-first:**

- An toàn type đầy đủ tại thời điểm compile.
- Tận dụng interfaces và decorators (`@Body()`, `@Param()`) để validate và transform data.

**Hệ sinh thái phong phú và khả năng mở rộng:**

- Tích hợp chính thức cho WebSockets, GraphQL, microservices (RabbitMQ, Kafka) và nhiều hơn nữa.
- Hàng trăm community modules (ví dụ `@nestjs/swagger` cho OpenAPI docs).

**Công cụ cấp production:**

- CLI tạo boilerplate (`nest g module`, `nest g service`).
- Hỗ trợ hot-reload trong development (`npm run start:dev`).
- Thiết lập testing tích hợp sẵn với Jest.

**Các trường hợp sử dụng thực tế:**

- Enterprise APIs với các ranh giới module nghiêm ngặt và RBAC.
- Kiến trúc Microservices, nơi mỗi service là một ứng dụng NestJS độc lập.
- Ứng dụng Real-time (chat, live dashboards) sử dụng WebSocket gateways của Nest.
- GraphQL backends với code-first schemas.
- Hệ thống Event-driven kết nối với message brokers.

### 2.2 So sánh với các Framework khác

| Tính năng | Express | Koa | NestJS |
|-----------|---------|-----|--------|
| Kiến trúc | Tối thiểu, không có quan điểm | Tối thiểu, dựa trên middleware | Modules/controllers/services có quan điểm |
| Dependency Injection | Kết nối thủ công | Kết nối thủ công | Tích hợp sẵn, reflect-metadata |
| Hỗ trợ TypeScript | Qua DefinitelyTyped | Qua DefinitelyTyped | First-class, decorators |
| CLI Tooling | Không có (3rd-party) | Không có | @nestjs/cli tạo code |
| Testing | Cấu hình người dùng | Cấu hình người dùng | Jest + DI làm cho mocking dễ dàng |
| Hệ sinh thái | Thư viện Middleware | Thư viện Middleware | Modules microservices, GraphQL, Swagger chính thức |
| Đường cong Học tập | Thấp | Thấp | Trung bình (học các thành ngữ Nest) |

- **Express** rất tốt nếu bạn muốn các lớp tối thiểu và kiểm soát đầy đủ, nhưng bạn sẽ phải tự tay làm nhiều thứ (DI, validation, cấu trúc thư mục).
- **Koa** cung cấp một cách tiếp cận middleware hiện đại hơn, nhưng vẫn để các quyết định kiến trúc cho bạn.
- **NestJS** cung cấp full stack: cấu trúc, DI, validation, testing và tích hợp chính thức, lý tưởng nếu bạn đánh giá cao tính nhất quán, type safety và các best practices out-of-the-box.

**Khi nào nên chọn NestJS:**

NestJS rất tuyệt vời cho nhiều trường hợp sử dụng. Nó đặc biệt hiệu quả nếu bạn đang xây dựng một API hoặc bộ microservice quy mô lớn, nếu bạn muốn một kiến trúc vững chắc ngay từ ngày đầu tiên, và nếu bạn thích TypeScript và DI để giữ code có thể kiểm thử và bảo trì được.

Với những lợi thế này trong tâm trí, bạn sẽ thấy rằng NestJS có thể tăng tốc đáng kể quá trình phát triển, đặc biệt là trên các dự án cần cấu trúc mạnh mẽ và ranh giới rõ ràng.

---

## 3. Bắt đầu

Hãy cùng tìm hiểu các bước cơ bản: cài đặt CLI, tạo một dự án mới và khám phá layout thư mục mặc định.

### 3.1 Cài đặt CLI

Nest đi kèm với một công cụ command-line chính thức giúp bạn tạo modules, controllers, services và nhiều hơn nữa. Bên dưới, nó sử dụng các templates Yeoman để giữ mọi thứ nhất quán.

```bash
# Cài đặt CLI globally (yêu cầu npm ≥ 6)
npm install -g @nestjs/cli
```

Sau khi cài đặt, bạn có thể chạy `nest --help` để xem các lệnh có sẵn:

```bash
nest --help
Usage: nest <command> [options]

Commands:
  new <name>       Scaffold một dự án mới
  generate|g <schematic> [options]  Tạo artifacts (modules, controllers, ...)
  build            Build project với webpack
  ...

Options:
  -v, --version    Hiển thị số phiên bản
  -h, --help       Hiển thị help
```

### 3.2 Tạo Dự án Đầu tiên

Tạo một ứng dụng mới chỉ với một lệnh duy nhất. CLI sẽ hỏi bạn có muốn sử dụng npm hay yarn, và có muốn bật các cài đặt TypeScript nghiêm ngặt không.

```bash
# Tạo một ứng dụng Nest mới trong thư mục "my-nest-app"
nest new my-nest-app
```

Sau khi trả lời các câu hỏi, bạn sẽ có:

```bash
cd my-nest-app
npm run start:dev
```

Điều này khởi chạy một development server trên `http://localhost:3000` với tự động reload khi có thay đổi file.

### 3.3 Tổng quan Cấu trúc Dự án

Theo mặc định, bạn sẽ thấy một cái gì đó như:

```
my-nest-app/
├── src/
│   ├── app.controller.ts      # controller ví dụ
│   ├── app.controller.spec.ts # unit test cho controller
│   ├── app.module.ts          # root application module
│   ├── app.service.ts         # provider ví dụ
│   └── main.ts                # entry point (bootstraps Nest)
├── test/                      # end-to-end tests
├── node_modules/
├── package.json
├── tsconfig.json
└── nest-cli.json             # CLI configuration
```

**src/main.ts** - Script "bootstrap". Nó tạo một instance ứng dụng Nest và bắt đầu lắng nghe trên một port:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

**src/app.module.ts** - Root module. Nó kết nối controllers và providers:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],                 // các modules khác để import
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**src/app.controller.ts / app.service.ts** - Một ví dụ đơn giản cho thấy dependency injection trong hành động:

```typescript
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, NestJS!';
  }
}
```

Với scaffold này, bạn có một ứng dụng NestJS tối thiểu – nhưng hoàn toàn chức năng. Từ đây, bạn có thể tạo các modules, controllers và services mới:

```bash
# Tạo một module, controller và service mới cho "tasks"
nest g module tasks
nest g controller tasks
nest g service tasks
```

Mỗi lệnh sẽ tạo một file `.ts` mới trong thư mục thích hợp và cập nhật metadata của module của bạn.

---

## 4. Các Khối Xây dựng Cốt lõi của NestJS

Ở trung tâm của mọi ứng dụng NestJS là ba trụ cột: Modules, Controllers và Providers (thường được gọi là Services). Hãy xem mỗi cái làm gì và chúng kết hợp với nhau như thế nào trong lý thuyết và thực hành.

### 4.1 Modules

Một Module là một ranh giới logic – một container nhóm các components liên quan (controllers, providers và thậm chí các modules khác). Mọi ứng dụng NestJS có ít nhất một root module (thường là AppModule), và bạn tạo các feature modules (UsersModule, AuthModule, v.v.) để tổ chức code theo domain.

**Decorator @Module():**

- `imports`: các modules khác để sử dụng
- `controllers`: controllers xử lý các incoming requests
- `providers`: services hoặc values có sẵn qua DI
- `exports`: providers nên được hiển thị cho các importing modules

Đây là một ví dụ:

```typescript
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  imports: [],            // ví dụ: TypeOrmModule.forFeature([Cat])
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // làm cho CatsService có sẵn cho các modules khác
})
export class CatsModule {}
```

Sau đó trong root module của bạn:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

Bây giờ bất cứ thứ gì inject CatsService sẽ resolve thành cái được định nghĩa bên trong CatsModule.

### 4.2 Controllers

Một Controller ánh xạ các incoming HTTP requests đến các handler methods. Nó chịu trách nhiệm trích xuất request data (query parameters, body, headers) và trả về một response. Controllers nên giữ mỏng – ủy quyền business logic cho providers.

**Các decorators chính:**

- `@Controller(path?)`: Định nghĩa một route prefix
- `@Get`, `@Post`, `@Put`, `@Delete`, v.v.: Định nghĩa các routes cấp method
- `@Param()`, `@Query()`, `@Body()`, `@Headers()`, `@Req()`, `@Res()`: Decorators để trích xuất chi tiết request

Đây là một ví dụ:

```typescript
// cats.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')                  // prefix: /cats
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.findAll();  // GET /cats
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);  // GET /cats/1
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);  // POST /cats
  }
}

// dto/create-cat.dto.ts
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed?: string;
}
```

### 4.3 Providers (Services)

Providers là các classes được chú thích với `@Injectable()` chứa business logic hoặc data access của bạn. Bất cứ thứ gì bạn muốn inject ở nơi khác phải là một provider. Bạn có thể cung cấp plain values, factory functions hoặc classes.

**Các điểm chính:**

- `@Injectable()`: Đánh dấu một class là có sẵn cho DI
- **Scope:** Mặc định là singleton, nhưng bạn có thể thay đổi thành request hoặc transient
- **Custom Providers:** Sử dụng `useClass`, `useValue`, `useFactory` hoặc `useExisting` để kiểm soát nhiều hơn

Đây là một ví dụ:

```typescript
// cats.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  private cats = [];

  create(dto: CreateCatDto) {
    const newCat = { id: Date.now(), ...dto };
    this.cats.push(newCat);
    return newCat;
  }

  findAll() {
    return this.cats;
  }

  findOne(id: number) {
    const cat = this.cats.find(c => c.id === id);
    if (!cat) {
      throw new NotFoundException(`Cat #${id} not found`);
    }
    return cat;
  }
}
```

**Inject một Custom Value:**

```typescript
// logger.provider.ts
export const LOGGER = {
  provide: 'LOGGER',
  useValue: console,
};

// app.module.ts
import { Module } from '@nestjs/common';
import { LOGGER } from './logger.provider';

@Module({
  providers: [LOGGER],
  exports: [LOGGER],
})
export class AppModule {}

// some.service.ts
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SomeService {
  constructor(@Inject('LOGGER') private readonly logger: Console) {}

  logMessage(msg: string) {
    this.logger.log(`Custom log: ${msg}`);
  }
}
```

Với modules kết nối controllers và providers, NestJS cung cấp cho bạn một nền tảng có thể mở rộng, có thể kiểm thử.

---

## 5. Dependency Injection

Hệ thống Dependency Injection (DI) tích hợp sẵn của Nest là trái tim của cách các components (controllers, services, v.v.) giao tiếp với nhau theo cách kết nối lỏng lẻo, có thể kiểm thử.

### 5.1 DI hoạt động như thế nào trong NestJS

Khi ứng dụng của bạn khởi động, Nest xây dựng một IoC container dựa trên module. Mỗi provider `@Injectable()` được đăng ký trong container dưới một token (theo mặc định, là class của nó). Khi một class khai báo một dependency trong constructor của nó, Nest tìm kiếm token đó và inject instance phù hợp.

**Các scopes:**

- **Singleton scope:** Một instance cho mỗi ứng dụng (mặc định)
- **Request scope:** Instance mới cho mỗi incoming request
- **Transient scope:** Instance mới mỗi khi nó được inject

Đây là một ví dụ:

```typescript
// cats.service.ts
@Injectable()
export class CatsService {
  // ...
}

// cats.controller.ts
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  // Nest thấy CatsService trong constructor,
  // tìm singleton instance của nó và inject nó.
}
```

Đằng sau hậu trường, Nest thu thập metadata từ decorators (`@Injectable()`, `@Controller()`) và xây dựng một đồ thị các providers. Khi bạn gọi `NestFactory.create(AppModule)`, nó resolve đồ thị đó và kết nối mọi thứ lại với nhau.

### 5.2 Custom Providers và Factory Providers

Đôi khi bạn cần inject các giá trị không phải class (APIs, constants) hoặc chạy logic tại thời điểm đăng ký. Nest cho phép bạn định nghĩa custom providers sử dụng cú pháp `provide`.

**useValue**

Inject một plain value hoặc object:

```typescript
// config.constant.ts
export const APP_NAME = {
  provide: 'APP_NAME',
  useValue: 'MyAwesomeApp',
};

// app.module.ts
@Module({
  providers: [APP_NAME],
  exports: ['APP_NAME'],
})
export class AppModule {}

// some.service.ts
@Injectable()
export class SomeService {
  constructor(@Inject('APP_NAME') private readonly name: string) {}

  whoAmI() {
    return `Running in ${this.name}`;
  }
}
```

**useClass**

Hoán đổi implementations dễ dàng (hữu ích cho testing hoặc feature flags):

```typescript
// logger.interface.ts
export interface Logger {
  log(msg: string): void;
}

// console-logger.ts
@Injectable()
export class ConsoleLogger implements Logger {
  log(msg: string) { console.log(msg); }
}

// file-logger.ts
@Injectable()
export class FileLogger implements Logger {
  log(msg: string) { /* write to file */ }
}

// app.module.ts
@Module({
  providers: [
    { provide: 'Logger', useClass: FileLogger },
  ],
})
export class AppModule {}

// any.service.ts
@Injectable()
export class AnyService {
  constructor(@Inject('Logger') private readonly logger: Logger) {}
}
```

**useFactory**

Chạy logic factory tùy ý (ví dụ: async initialization, dynamic config):

```typescript
// database.provider.ts
export const DATABASE = {
  provide: 'DATABASE',
  useFactory: async (config: ConfigService) => {
    const connection = await createConnection({
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
    });
    return connection;
  },
  inject: [ConfigService],
};
```

---

## 6. Routing & Middleware

### 6.1 Định nghĩa Routes

Trong NestJS, routes được định nghĩa bằng cách sử dụng decorators trên các controller methods. Decorator `@Controller()` định nghĩa route prefix, và các decorators như `@Get()`, `@Post()`, `@Put()`, `@Delete()` định nghĩa các HTTP methods cụ thể.

```typescript
@Controller('products')
export class ProductsController {
  @Get()
  findAll() {
    return 'Tất cả sản phẩm';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Sản phẩm #${id}`;
  }

  @Post()
  create(@Body() createDto: CreateProductDto) {
    return 'Tạo sản phẩm mới';
  }
}
```

### 6.2 Áp dụng Middleware

Middleware là các functions được thực thi trước khi route handler. Chúng có thể thực hiện các tác vụ như logging, authentication, validation, v.v.

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  }
}

// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // áp dụng cho tất cả routes
  }
}
```

---

## 7. Request Lifecycle & Pipes

### 7.1 Pipes là gì?

Pipes là các classes được chú thích với decorator `@Injectable()` và implement interface `PipeTransform`. Chúng có hai use cases chính:

- **Transformation:** Chuyển đổi input data thành dạng mong muốn
- **Validation:** Đánh giá input data và throw exception nếu không hợp lệ

### 7.2 Built-In vs. Custom Pipes

**Built-in Pipes:**

NestJS cung cấp một số pipes tích hợp sẵn:

- `ValidationPipe`: Validate và transform dựa trên class-validator decorators
- `ParseIntPipe`: Parse string thành integer
- `ParseBoolPipe`: Parse string thành boolean
- `ParseArrayPipe`: Parse string thành array
- `ParseUUIDPipe`: Validate UUID strings

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

**Custom Pipes:**

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

// Sử dụng
@Post()
create(@Body(CustomValidationPipe) createDto: CreateCatDto) {
  return this.catsService.create(createDto);
}
```

---

## 8. Guards & Authorization

### 8.1 Triển khai Guards

Guards là các classes được chú thích với decorator `@Injectable()` và implement interface `CanActivate`. Chúng xác định xem một request có được xử lý bởi route handler hay không.

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // Logic xác thực
    return true;
  }
}

// Sử dụng
@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {
  // ...
}
```

### 8.2 Role-Based Access Control

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Sử dụng
@Post()
@Roles('admin')
create(@Body() createDto: CreateCatDto) {
  return this.catsService.create(createDto);
}

// RolesGuard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some(role => user.roles?.includes(role));
  }
}
```

---

## 9. Exception Filters

### 9.1 Xử lý Lỗi một cách Tinh tế

NestJS có một lớp exception tích hợp sẵn chịu trách nhiệm xử lý tất cả các exceptions chưa được xử lý trong ứng dụng.

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

// Hoặc với custom response
throw new HttpException({
  status: HttpStatus.FORBIDDEN,
  error: 'This is a custom message',
}, HttpStatus.FORBIDDEN);
```

### 9.2 Tạo Custom Filters

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}

// Sử dụng
@Post()
@UseFilters(HttpExceptionFilter)
create(@Body() createDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

---

## 10. Interceptors & Logging

### 10.1 Chuyển đổi Responses

Interceptors là các classes được chú thích với decorator `@Injectable()` và implement interface `NestInterceptor`. Chúng có thể:

- Bind thêm logic trước/sau method execution
- Transform kết quả trả về từ một function
- Transform exception được throw từ một function
- Mở rộng hành vi function cơ bản
- Ghi đè hoàn toàn một function

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}

// Sử dụng
@UseInterceptors(TransformInterceptor)
export class CatsController {}
```

### 10.2 Logging và Performance Metrics

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    return next
      .handle()
      .pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(`${method} ${url} ${responseTime}ms`);
        }),
      );
  }
}
```

---

## 11. Tích hợp Database

### 11.1 TypeORM với NestJS

TypeORM là một ORM có thể chạy trong Node.js và có thể được sử dụng với TypeScript và JavaScript.

**Cài đặt:**

```bash
npm install @nestjs/typeorm typeorm mysql2
# hoặc postgres, sqlite3, v.v.
```

**Cấu hình:**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // chỉ dùng trong development
    }),
  ],
})
export class AppModule {}
```

**Tạo Entity:**

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
```

**Sử dụng Repository:**

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

### 11.2 Mongoose (MongoDB)

Mongoose là một công cụ modeling object MongoDB được thiết kế để hoạt động trong môi trường asynchronous.

**Cài đặt:**

```bash
npm install @nestjs/mongoose mongoose
```

**Cấu hình:**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule {}
```

**Tạo Schema:**

```typescript
// cat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

**Sử dụng Model:**

```typescript
// cats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string): Promise<Cat> {
    return this.catModel.findById(id).exec();
  }
}
```

### 11.3 Prisma

Prisma là một ORM thế hệ tiếp theo cung cấp type-safety và developer experience tuyệt vời.

**Cài đặt:**

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Định nghĩa Schema:**

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

**Tạo Prisma Service:**

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**Sử dụng Prisma:**

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
```

---

## 12. Quản lý Configuration

### 12.1 Module @nestjs/config

Module `@nestjs/config` cung cấp một cách mạnh mẽ để quản lý cài đặt cấu hình ứng dụng.

**Cài đặt:**

```bash
npm install @nestjs/config
```

**Cấu hình:**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // làm cho ConfigService có sẵn toàn cục
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
```

**Sử dụng ConfigService:**

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT', 5432); // với giá trị mặc định
  }
}
```

**Custom Configuration Files:**

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});

// app.module.ts
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```

### 12.2 Environment Variables

Tạo file `.env` trong thư mục root:

```env
# .env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=mydb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

**Validation Schema:**

```typescript
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
  ],
})
export class AppModule {}
```

---

## 13. Authentication

### 13.1 JWT Strategy

**Cài đặt:**

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

**Cấu hình JWT Module:**

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Auth Service:**

```typescript
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

**JWT Strategy:**

```typescript
// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

**JWT Auth Guard:**

```typescript
// jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Sử dụng
@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### 13.2 OAuth2 / Social Login

OAuth2 cho phép người dùng đăng nhập bằng các nhà cung cấp bên thứ ba như Google, Facebook, GitHub, v.v.

**Cài đặt (ví dụ với Google):**

```bash
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

**Google Strategy:**

```typescript
// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
```

**Auth Controller:**

```typescript
// auth.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Khởi tạo Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Xử lý callback từ Google
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
```

**Environment Variables:**

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 14. Kết luận & Tài nguyên Bổ sung

### Tóm tắt

Chúng ta đã đi qua các khía cạnh chính của việc xây dựng một ứng dụng NestJS:

- **Các mẫu kiến trúc:** Modules, Controllers, Providers và cách chúng làm việc cùng nhau
- **Dependency Injection:** Hệ thống DI mạnh mẽ của NestJS và cách sử dụng custom providers
- **Routing & Middleware:** Định nghĩa routes và áp dụng middleware
- **Request Lifecycle:** Pipes, Guards, Exception Filters và Interceptors
- **Tích hợp Database:** TypeORM, Mongoose và Prisma
- **Configuration Management:** Quản lý environment variables và configuration
- **Authentication:** JWT và OAuth2/Social Login strategies

NestJS cung cấp một framework có cấu trúc, TypeScript-first để tăng tốc phát triển các backends có khả năng mở rộng, có thể bảo trì. Bằng cách tận dụng hệ thống module và các tích hợp tích hợp sẵn, bạn có được tính nhất quán, khả năng kiểm thử và sự tách biệt rõ ràng các mối quan tâm ngay từ đầu.

Cho dù bạn chọn một relational database qua TypeORM, một document store với Mongoose, hay Prisma's type-safe client, bạn có thể cắm chúng vào DI container và configuration module của Nest. Các authentication flows – cả JWT-based và social login – phù hợp tự nhiên với tích hợp Passport của Nest.

Nhìn chung, NestJS rất phù hợp cho APIs, microservices, ứng dụng real-time và enterprise backends nơi khả năng bảo trì và developer experience quan trọng.

### Tài liệu Chính thức và Liên kết Cộng đồng

**Tài liệu chính thức:**
- [NestJS Official Documentation](https://docs.nestjs.com) - Hướng dẫn toàn diện và tài liệu tham khảo API cho tất cả các tính năng cốt lõi

**GitHub Repository:**
- [NestJS GitHub](https://github.com/nestjs/nest) - Source code, issue tracker và đóng góp từ cộng đồng

**Các tài nguyên học tập khác:**
- [NestJS Courses](https://courses.nestjs.com) - Các khóa học chính thức
- [NestJS Discord](https://discord.gg/nestjs) - Cộng đồng Discord
- [Awesome NestJS](https://github.com/nestjs/awesome-nestjs) - Danh sách các tài nguyên, plugins và tools

**Best Practices:**
- Luôn sử dụng TypeScript để tận dụng type safety
- Tổ chức code theo modules dựa trên domain
- Sử dụng DTOs (Data Transfer Objects) cho validation
- Implement proper error handling với Exception Filters
- Viết unit tests và e2e tests
- Sử dụng environment variables cho configuration
- Follow SOLID principles
- Document APIs với Swagger/OpenAPI

---

**Chúc bạn học tập vui vẻ và xây dựng những ứng dụng tuyệt vời với NestJS! 🚀**


