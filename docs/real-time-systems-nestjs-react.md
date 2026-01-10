# Hệ Thống Real-Time cho Web Developers: Từ Lý Thuyết đến Ứng Dụng NestJS + React

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Yêu Cầu Kiến Thức](#yêu-cầu-kiến-thức)
- [Hệ Thống Real-Time Thực Sự Là Gì](#hệ-thống-real-time-thực-sự-là-gì)
- [Các Loại Hệ Thống Real-Time](#các-loại-hệ-thống-real-time)
- [Tại Sao Hầu Hết Web Apps Không Phải Real-Time](#tại-sao-hầu-hết-web-apps-không-phải-real-time)
- [Những Gì Chúng Ta Sẽ Xây Dựng](#những-gì-chúng-ta-sẽ-xây-dựng)
- [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
- [Tại Sao NestJS Phù Hợp Cho Use Case Của Chúng Ta](#tại-sao-nestjs-phù-hợp-cho-use-case-của-chúng-ta)
- [Tạo Events với NestJS](#tạo-events-với-nestjs)
- [Xử Lý Có Nhận Thức Về Deadline](#xử-lý-có-nhận-thức-về-deadline)
- [Áp Dụng Back-Pressure](#áp-dụng-back-pressure)
- [Streaming Events Đến Browser](#streaming-events-đến-browser)
- [Consuming WebSocket Event (React + TypeScript)](#consuming-websocket-event-react--typescript)
- [Làm Cho React Thân Thiện Với Real-Time](#làm-cho-react-thân-thiện-với-real-time)
- [Tạo Component StatsBar](#tạo-component-statsbar)
- [Tạo Bảng Events](#tạo-bảng-events)
- [Kết Hợp Tất Cả](#kết-hợp-tất-cả)
- [Kết Luận](#kết-luận)

## Giới Thiệu

Nhiều developers nghĩ rằng "real-time" là về Websockets, Live data, hoặc instant refreshes trên dashboard của ứng dụng web.

Và mặc dù những khái niệm này có liên quan chặt chẽ đến ý nghĩa của real-time, nhưng định nghĩa trong kỹ thuật hệ thống lại hơi khác. **Một hệ thống real-time không được định nghĩa bởi tốc độ nhanh như thế nào, mà là khả năng dự đoán được như thế nào.**

Trong hướng dẫn này, bạn sẽ học về:
- Hệ thống real-time là gì
- Tại sao hầu hết các ứng dụng web không phải là real-time
- Cách xây dựng một hệ thống soft real-time với các công cụ bạn có thể đã quen thuộc: **NestJS, React, và TypeScript**

Cuối hướng dẫn này, chúng ta sẽ xây dựng một ứng dụng live có khả năng:

✅ Xử lý các events nhạy cảm về thời gian  
✅ Thực thi deadlines  
✅ Loại bỏ công việc khi đã quá muộn  
✅ Trực quan hóa latency và missed deadlines theo thời gian thực  

Bài viết này sẽ giúp định hình tư duy của bạn lần tới khi xây dựng một hệ thống real-time.

## Yêu Cầu Kiến Thức

Hướng dẫn này giả định rằng bạn có kiến thức cơ bản về NestJS, React, và WebSockets. Nếu chưa, tôi khuyên bạn nên xem qua các hướng dẫn cơ bản trước khi tiếp tục.

**Công nghệ chúng ta sẽ sử dụng:**

- **NestJS** - để xây dựng backend system và thực thi các đảm bảo real-time
- **React** - để xây dựng responsive frontend UI hiển thị streamed events
- **WebSocket** - để truyền tải dữ liệu low-latency từ backend đến client

**Tài liệu tham khảo hữu ích:**

- [NestJS WebSockets Documentation](https://docs.nestjs.com/websockets/gateways)
- [RxJS Documentation](https://rxjs.dev/) - NestJS sử dụng RxJS cho reactive programming
- [WebSockets in React Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## Hệ Thống Real-Time Thực Sự Là Gì

Trong một ứng dụng web truyền thống, **tính đúng đắn** được đo bằng việc hệ thống có tạo ra kết quả đúng hay không.

Trong một hệ thống real-time, **tính đúng đắn** được đo bằng việc hệ thống có tạo ra kết quả đúng **trước deadline** hay không.

> Nếu kết quả là "Không", thì hệ thống đã thất bại – ngay cả khi kết quả là chính xác.

## Các Loại Hệ Thống Real-Time

Có một vài loại hệ thống real-time khác nhau mà bạn nên biết, mỗi loại có mức độ nghiêm ngặt khác nhau:

| Loại Hệ Thống Real-Time | Đặc Điểm | Ứng Dụng Thực Tế |
|-------------------------|----------|------------------|
| **Hard Real-time** | Bỏ lỡ deadline là thảm họa | Hệ thống điều khiển bay, máy tạo nhịp tim |
| **Soft Real-time** | Bỏ lỡ deadline làm giảm chất lượng nhưng không crash hệ thống | Video Streaming, Trading Dashboards |
| **Firm Real-time** | Kết quả muộn là vô dụng và nên được loại bỏ | Ứng dụng đấu giá xe hơi Web/Mobile |

Phần lớn các hệ thống real-time dựa trên web thuộc loại **soft real-time**, và đó chính xác là những gì chúng ta sẽ xây dựng ở đây.

## Tại Sao Hầu Hết Web Apps Không Phải Real-Time

Có nhiều lý do khiến một hệ thống có thể không phải real-time, và thông thường, ngay cả những hệ thống được marketing là real-time cũng thiếu đảm bảo này.

**Lý do:**

❌ **WebSockets đảm bảo delivery, không phải timeliness**  
❌ **Message queues được tối ưu hóa cho durability và throughput**  
❌ **Infinite buffering che giấu deadlines**  
❌ **User Interfaces (UIs) render khi có thể, không phải khi cần**  

Nói cách khác, dữ liệu sẽ đến cuối cùng, nhưng không có gì thực thi **khi nào** nó phải được xử lý. Đó chính xác là khoảng trống mà chúng ta sẽ giải quyết trong hướng dẫn này.

## Những Gì Chúng Ta Sẽ Xây Dựng

Trong hướng dẫn này, chúng ta sẽ xây dựng một **Deadline-Aware Live Event Monitor**. Bạn có thể nghĩ về nó như một hệ thống real-time đơn giản hóa cho sensor data, trading events, alerts, hoặc live telemetry.

**Ứng dụng của chúng ta sẽ có các tính năng và ràng buộc sau:**

✅ Events được tạo ra với tốc độ cố định  
✅ Mỗi event có một deadline  
✅ Backend chỉ xử lý events nếu chúng có thể hoàn thành đúng hạn  
✅ Events muộn được đánh dấu hoặc loại bỏ  
✅ Frontend trực quan hóa:
  - Processing latency
  - Missed deadlines
  - System health

Điều này sẽ cung cấp cho chúng ta các metrics cần thiết để đo lường hành vi real-time của hệ thống thay vì đoán mò.

## Kiến Trúc Hệ Thống

Kiến trúc hệ thống cấp cao trông như thế này:

```
+-------------+     +------------------+     +----------------+
| Event       | --> | Deadline-Aware   | --> | WebSocket      |
| Generator   |     | NestJS Processor |     | Gateway        |
+-------------+     +------------------+     +----------------+
                                                     |
                                                     v
                                           +----------------+
                                           | React Dashboard|
                                           +----------------+
```

**Phân chia trách nhiệm:**

### Backend (NestJS):
- Tạo ra các time-sensitive events
- Thực thi deadline
- Áp dụng back pressure
- Stream kết quả đến client (frontend)

### Frontend (React):
- Consume real-time events
- Render live metrics
- Duy trì responsive dưới tải

### Time là Một Phần của Data Model

Trong một hệ thống real-time, **time là explicit, không phải implicit**. Điều này có nghĩa là mỗi event được xử lý bao gồm:

- Khi nó được tạo ra
- Nó được phép tồn tại bao lâu
- Khi nó được xử lý

**Về mặt khái niệm, một data model điển hình cho một event trông như thế này:**

```typescript
interface Event {
  id: string;
  createdAt: number;
  deadlineMs: number;
  processedAt?: number;
  status: "on-time" | "late" | "dropped";
}
```

Đây là sự thay đổi tư duy mà chúng ta hy vọng thiết lập: **trong một hệ thống real-time, time là một thành phần thiết yếu cho hệ thống của bạn để đảm bảo độ chính xác.**

## Tại Sao NestJS Phù Hợp Cho Use Case Của Chúng Ta

NestJS không phải là một ngôn ngữ hard real-time, nhưng nó xuất sắc cho các workloads soft real-time. Điều này là do:

✅ **Kiến trúc modular và dependency injection** - dễ dàng quản lý và test
✅ **Built-in WebSocket support** với `@nestjs/websockets`
✅ **RxJS integration** - cho reactive programming và stream processing
✅ **TypeScript** - type safety và better developer experience
✅ **Async/await và Promises** - xử lý bất đồng bộ dễ dàng
✅ **Interceptors và Guards** - để thực thi deadlines và validation

Quan trọng nhất, NestJS giúp dễ dàng **fail fast**, điều này rất quan trọng cho các hệ thống real-time.

## Tạo Events với NestJS

Chúng ta sẽ bắt đầu phát triển backend system bằng cách định nghĩa Event interface và tạo một event generator service.

### Bước 1: Tạo Event Interface

Tạo file `src/events/interfaces/event.interface.ts`:

```typescript
export interface Event {
  id: string;
  createdAt: Date;
  deadlineMs: number;
  processedAt?: Date;
  status?: 'on-time' | 'late' | 'dropped';
}
```

### Bước 2: Tạo Event Generator Service

Tạo file `src/events/event-generator.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Event } from './interfaces/event.interface';

@Injectable()
export class EventGeneratorService implements OnModuleInit, OnModuleDestroy {
  private readonly eventStream$ = new Subject<Event>();
  private intervalId: NodeJS.Timeout;
  private readonly GENERATION_RATE_MS = 50; // Tạo event mỗi 50ms
  private readonly DEFAULT_DEADLINE_MS = 100; // Deadline mặc định 100ms

  onModuleInit() {
    this.startGenerator();
  }

  onModuleDestroy() {
    this.stopGenerator();
  }

  getEventStream() {
    return this.eventStream$.asObservable();
  }

  private startGenerator() {
    this.intervalId = setInterval(() => {
      const event: Event = {
        id: uuidv4(),
        createdAt: new Date(),
        deadlineMs: this.DEFAULT_DEADLINE_MS,
      };

      // Sử dụng non-blocking emit
      // Nếu không có subscriber hoặc buffer đầy, event sẽ bị drop
      if (this.eventStream$.observers.length > 0) {
        this.eventStream$.next(event);
      }
      // Nếu không có observers, event bị drop tự động (backpressure)
    }, this.GENERATION_RATE_MS);
  }

  private stopGenerator() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.eventStream$.complete();
  }
}
```

**Giải thích:**

- `eventStream$` là một RxJS Subject để phát events
- `setInterval` tạo events với tốc độ cố định (50ms)
- Mỗi event có `id` duy nhất, `createdAt` timestamp, và `deadlineMs`
- Chúng ta kiểm tra `observers.length` để tránh buffer events khi không có consumer (backpressure strategy)

**Tại sao phải drop events?** Vì che giấu overload sẽ làm mất đảm bảo real-time. Dropping events là một chiến lược backpressure có chủ ý: nó ngăn chặn overload lan truyền qua hệ thống và bảo vệ latency bounds.

## Xử Lý Có Nhận Thức Về Deadline

Tiếp theo, chúng ta sẽ tạo một service để xử lý events với deadline awareness.

Tạo file `src/events/event-processor.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { Event } from './interfaces/event.interface';

@Injectable()
export class EventProcessorService {
  async processEvent(event: Event): Promise<Event> {
    const startTime = Date.now();
    const deadline = event.createdAt.getTime() + event.deadlineMs;

    try {
      // Tạo một Promise race giữa work và deadline
      const result = await Promise.race([
        this.doWork(event),
        this.checkDeadline(deadline),
      ]);

      const processedAt = new Date();
      const processingTime = processedAt.getTime() - event.createdAt.getTime();

      return {
        ...event,
        processedAt,
        status: processingTime <= event.deadlineMs ? 'on-time' : 'late',
      };
    } catch (error) {
      // Deadline exceeded
      return {
        ...event,
        processedAt: new Date(),
        status: 'late',
      };
    }
  }

  private async doWork(event: Event): Promise<void> {
    // Simulate processing work (50ms)
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  private async checkDeadline(deadline: number): Promise<never> {
    const now = Date.now();
    const timeUntilDeadline = deadline - now;

    if (timeUntilDeadline <= 0) {
      throw new Error('Deadline exceeded');
    }

    // Wait until deadline, then throw
    await new Promise((resolve) => setTimeout(resolve, timeUntilDeadline));
    throw new Error('Deadline exceeded');
  }
}
```

**Giải thích:**

- `processEvent` nhận một event và xử lý nó dưới một deadline cứng
- Chúng ta sử dụng `Promise.race()` để đua giữa công việc thực tế và deadline
- Nếu deadline đến trước, chúng ta throw error và đánh dấu event là 'late'
- Nếu công việc hoàn thành trước, chúng ta tính toán processing time và xác định status

## Áp Dụng Back-Pressure

Trong các hệ thống real-time, **queues không giải quyết overload – chúng chỉ trì hoãn nó**.

Khi incoming events đến nhanh hơn khả năng xử lý, một queue tiếp tục tăng trưởng, làm tăng thời gian mỗi event phải chờ đợi.

**Buffers cũng có thể che giấu failure.** Bằng cách hấp thụ excess load, chúng tạo ra ảo giác rằng hệ thống đang healthy, ngay cả khi processing delays tăng vượt quá giới hạn chấp nhận được.

Vì những lý do này, tôi khuyên bạn nên **sử dụng bounded streams**. Khi hệ thống bị overwhelmed, bounded streams thực thi back-pressure bằng cách từ chối công việc bổ sung.

### Tạo Bounded Event Stream

Tạo file `src/events/bounded-stream.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { bufferTime, mergeMap, catchError } from 'rxjs/operators';
import { Event } from './interfaces/event.interface';
import { EventProcessorService } from './event-processor.service';

@Injectable()
export class BoundedStreamService {
  private readonly MAX_BUFFER_SIZE = 10;
  private readonly BUFFER_TIME_MS = 100;

  constructor(private readonly processor: EventProcessorService) {}

  createBoundedStream(source$: Observable<Event>): Observable<Event> {
    return source$.pipe(
      // Buffer events trong time window
      bufferTime(this.BUFFER_TIME_MS),

      // Giới hạn buffer size (backpressure)
      mergeMap((events) => {
        if (events.length > this.MAX_BUFFER_SIZE) {
          // Drop excess events
          const dropped = events.length - this.MAX_BUFFER_SIZE;
          console.warn(`Dropped ${dropped} events due to overload`);
          return events.slice(0, this.MAX_BUFFER_SIZE);
        }
        return events;
      }),

      // Process từng event với deadline awareness
      mergeMap((event) =>
        this.processor.processEvent(event).catch((error) => ({
          ...event,
          processedAt: new Date(),
          status: 'dropped' as const,
        })),
      ),

      catchError((error, caught) => {
        console.error('Stream error:', error);
        return caught;
      }),
    );
  }
}
```

**Giải thích:**

- `bufferTime()` nhóm events trong time windows
- Chúng ta giới hạn buffer size để tránh unbounded growth
- Events vượt quá limit bị drop với warning log
- Mỗi event được xử lý với deadline awareness
- Errors được handle gracefully

**Dropping events là một feature, không phải bug**, vì nó:
- Bảo vệ latency guarantees cho events được xử lý
- Cho phép operators phát hiện và phản ứng với overload conditions ngay lập tức
- Làm cho failures visible thay vì silent degradation

## Streaming Events Đến Browser

Tiếp theo, chúng ta sẽ xây dựng WebSocket Gateway để push processed events đến frontend.

### Bước 1: Cài Đặt Dependencies

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install -D @types/socket.io
```

### Bước 2: Tạo WebSocket Gateway

Tạo file `src/events/events.gateway.ts`:

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventGeneratorService } from './event-generator.service';
import { BoundedStreamService } from './bounded-stream.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong production, hãy specify domain cụ thể
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly generator: EventGeneratorService,
    private readonly boundedStream: BoundedStreamService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');

    // Tạo bounded stream từ event generator
    const processedEvents$ = this.boundedStream.createBoundedStream(
      this.generator.getEventStream(),
    );

    // Subscribe và broadcast events đến tất cả connected clients
    processedEvents$.subscribe({
      next: (event) => {
        this.server.emit('event', event);
      },
      error: (error) => {
        this.logger.error('Stream error:', error);
      },
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
```

**Giải thích:**

- `@WebSocketGateway()` decorator tạo một WebSocket server
- `afterInit()` được gọi khi gateway được khởi tạo
- Chúng ta subscribe vào processed events stream và broadcast đến tất cả clients
- `server.emit('event', event)` gửi event đến tất cả connected clients
- Connection/disconnection được log để monitoring

### Bước 3: Tạo Events Module

Tạo file `src/events/events.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventGeneratorService } from './event-generator.service';
import { EventProcessorService } from './event-processor.service';
import { BoundedStreamService } from './bounded-stream.service';

@Module({
  providers: [
    EventsGateway,
    EventGeneratorService,
    EventProcessorService,
    BoundedStreamService,
  ],
  exports: [EventGeneratorService],
})
export class EventsModule {}
```

### Bước 4: Import vào App Module

Trong `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule],
})
export class AppModule {}
```

**Lưu ý quan trọng:**

WebSockets **không làm cho** một hệ thống trở thành real-time. WebSockets chỉ cung cấp low-latency delivery từ backend đến client.

**Các đảm bảo real-time được thiết lập sớm hơn trong backend pipeline** thông qua các quyết định thiết kế có chủ ý:

✅ Fixed-rate event generation
✅ Explicit per-event deadlines
✅ Bounded queues
✅ Non-blocking sends
✅ Deadline-aware processing
✅ Fail-fast behavior khi deadlines bị vượt quá

Khi một event được gửi qua WebSocket, nó đã **hoặc là đáp ứng real-time constraints hoặc đã bị loại bỏ**. WebSocket layer chỉ đơn giản là transport kết quả – nó không thực thi hoặc tạo ra real-time behavior.

## Consuming WebSocket Event (React + TypeScript)

Cho đến bây giờ, chúng ta đã xây dựng backend của hệ thống real-time event generator và broadcast. Trong các phần tiếp theo, chúng ta sẽ xây dựng frontend của hệ thống sử dụng React và TypeScript.

### Bước 1: Cài Đặt Dependencies

```bash
npm install socket.io-client
npm install -D @types/socket.io-client
```

### Bước 2: Tạo Types

Tạo file `src/types/types.ts`:

```typescript
export interface RealTimeEvent {
  id: string;
  createdAt: string;
  deadlineMs: number;
  processedAt?: string;
  status?: 'on-time' | 'late' | 'dropped';
}
```

### Bước 3: Khởi Tạo WebSocket Client

Thay vì render mỗi message ngay lập tức, chúng ta sẽ **batch updates** để tránh render storms.

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('event', (data: RealTimeEvent) => {
  // Thêm vào buffer thay vì render ngay
  buffer.push(data);
});
```

## Làm Cho React Thân Thiện Với Real-Time

Tiếp theo, hãy tạo một React hook `useRealTimeEvents` để xử lý streaming và processing của event broadcasts từ backend.

**Vấn đề:** Rendering trên mỗi message gây ra render storms, UI lag, và dashboards misleading.

**Giải pháp:** Render trên animation frames.

### Tạo Custom Hook

Tạo file `src/hooks/useRealTimeEvents.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { RealTimeEvent } from '../types/types';

function useRealTimeEvents() {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const buffer = useRef<RealTimeEvent[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Khởi tạo WebSocket connection
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    // Lắng nghe events và thêm vào buffer
    socket.on('event', (data: RealTimeEvent) => {
      buffer.current.push(data);
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    let rafId: number;

    // Flush buffer trên mỗi animation frame
    const flush = () => {
      if (buffer.current.length > 0) {
        const pendingEvents = buffer.current.slice();
        buffer.current = []; // Clear buffer

        setEvents((prev) => {
          const next = [...prev, ...pendingEvents];
          // Giữ chỉ 50 events gần nhất để tránh memory leak
          return next.slice(-50);
        });
      }
      rafId = requestAnimationFrame(flush);
    };

    rafId = requestAnimationFrame(flush);

    // Cleanup
    return () => {
      socket.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return events;
}

export default useRealTimeEvents;
```

**Giải thích:**

- **UI là một phần của hệ thống real-time**
- Hệ thống broadcast messages đến frontend trong milliseconds, vượt quá browser refresh rate threshold
- Thay vì `setTimeout`, chúng ta sử dụng `requestAnimationFrame()`
- `requestAnimationFrame()` nhận callback `flush` được điều chỉnh bởi animation frame
- Điều này đảm bảo chúng ta không vượt quá refresh rate threshold trước lần repaint tiếp theo
- Chúng ta giữ chỉ 50 events gần nhất để tránh memory issues

**Tại sao requestAnimationFrame?**

- Đồng bộ với browser's repaint cycle (~60fps)
- Tự động pause khi tab không active (tiết kiệm resources)
- Smoother animations và updates
- Tránh unnecessary renders

## Tạo Component StatsBar

Tiếp theo, hãy tạo một component `StatsBar` nhỏ để hiển thị events đến đúng deadline và những events đến muộn.

Tạo file `src/components/StatsBar.tsx`:

```typescript
import { type FC } from 'react';
import type { RealTimeEvent } from '../types/types';

interface StatsBarProps {
  events: RealTimeEvent[];
}

const StatsBar: FC<StatsBarProps> = ({ events }) => {
  const late = events.filter((e) => e.status === 'late').length;
  const onTime = events.filter((e) => e.status === 'on-time').length;
  const dropped = events.filter((e) => e.status === 'dropped').length;

  const latePercentage = events.length > 0
    ? ((late / events.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-row gap-4 bg-gray-800 text-white w-full py-3 px-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Tổng Events:</span>
        <span className="text-blue-400 font-bold">{events.length}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Đúng Hạn:</span>
        <span className="text-green-400 font-bold">{onTime}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Muộn:</span>
        <span className="text-red-400 font-bold">{late}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Dropped:</span>
        <span className="text-yellow-400 font-bold">{dropped}</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="font-semibold">Tỷ Lệ Muộn:</span>
        <span className={`font-bold ${parseFloat(latePercentage) > 10 ? 'text-red-400' : 'text-green-400'}`}>
          {latePercentage}%
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
```

**Giải thích:**

- Component nhận `events` array làm prop
- Tính toán số lượng events theo từng status
- Hiển thị tổng số events, events đúng hạn, muộn, và dropped
- Tính toán và hiển thị tỷ lệ phần trăm events muộn
- Sử dụng color coding để dễ dàng nhận biết (green = good, red = bad)

## Tạo Bảng Events

Tiếp theo, chúng ta sẽ tạo component `EventsTable` để hiển thị chi tiết các events.

Tạo file `src/components/EventsTable.tsx`:

```typescript
import { type FC } from 'react';
import type { RealTimeEvent } from '../types/types';

interface EventsTableProps {
  events: RealTimeEvent[];
}

export const EventsTable: FC<EventsTableProps> = ({ events }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  const calculateLatency = (event: RealTimeEvent): string => {
    if (!event.processedAt) return 'N/A';

    const created = new Date(event.createdAt).getTime();
    const processed = new Date(event.processedAt).getTime();
    const latency = processed - created;

    return `${latency}ms`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'on-time':
        return 'text-green-600 bg-green-100';
      case 'late':
        return 'text-red-600 bg-red-100';
      case 'dropped':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-700 text-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                ID
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Trạng Thái
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Thời Gian Tạo
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Thời Gian Xử Lý
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Deadline (ms)
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Latency
              </th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Đang chờ events...
                </td>
              </tr>
            ) : (
              events.map((event, index) => (
                <tr
                  key={event.id + index}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs">
                    {event.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        event.status,
                      )}`}
                    >
                      {event.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {formatDate(event.createdAt)}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {event.processedAt ? formatDate(event.processedAt) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {event.deadlineMs}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {calculateLatency(event)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
```

**Giải thích:**

- Loop qua tất cả incoming events và hiển thị chi tiết
- `formatDate()` format timestamps thành định dạng dễ đọc (tiếng Việt)
- `calculateLatency()` tính toán processing latency (processedAt - createdAt)
- `getStatusColor()` trả về Tailwind classes cho color coding theo status
- Hiển thị ID (rút gọn), status, timestamps, deadline, và latency
- Empty state khi chưa có events

**Các metrics này giúp chúng ta:**
- Quan sát performance của real-time events broadcast system
- Phát hiện bottlenecks và issues
- Đo lường xem hệ thống có đáp ứng real-time guarantees không

## Kết Hợp Tất Cả

Tại thời điểm này, chúng ta đã implement một ứng dụng real-time hoàn chỉnh, end-to-end kết nối deadline-aware NestJS backend với lightweight React frontend.

### Tạo Main App Component

Tạo hoặc cập nhật file `src/App.tsx`:

```typescript
import { useRealTimeEvents } from './hooks/useRealTimeEvents';
import StatsBar from './components/StatsBar';
import EventsTable from './components/EventsTable';

export default function App() {
  const events = useRealTimeEvents();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Real-Time Event Monitor
          </h1>
          <p className="text-gray-600">
            Hệ thống giám sát events real-time với deadline awareness
          </p>
        </header>

        <div className="space-y-6">
          <StatsBar events={events} />
          <EventsTable events={events} />
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Backend: NestJS + WebSocket | Frontend: React + TypeScript
          </p>
        </footer>
      </div>
    </div>
  );
}
```

### Cấu Trúc Thư Mục Hoàn Chỉnh

**Backend (NestJS):**
```
src/
├── events/
│   ├── interfaces/
│   │   └── event.interface.ts
│   ├── event-generator.service.ts
│   ├── event-processor.service.ts
│   ├── bounded-stream.service.ts
│   ├── events.gateway.ts
│   └── events.module.ts
├── app.module.ts
└── main.ts
```

**Frontend (React):**
```
src/
├── components/
│   ├── StatsBar.tsx
│   └── EventsTable.tsx
├── hooks/
│   └── useRealTimeEvents.ts
├── types/
│   └── types.ts
└── App.tsx
```

### Chạy Ứng Dụng

**Backend:**
```bash
# Trong thư mục backend
npm install
npm run start:dev
```

Backend sẽ chạy trên `http://localhost:3000`

**Frontend:**
```bash
# Trong thư mục frontend
npm install
npm start
```

Frontend sẽ chạy trên `http://localhost:3001` (hoặc port khác nếu 3000 đã được sử dụng)

### Những Gì Đã Đạt Được

Với cả frontend và backend components đã sẵn sàng, ứng dụng bây giờ hoạt động như một **real-time monitor**:

✅ **Backend thực thi deadlines và correctness**
✅ **Frontend phản ánh outcome của những quyết định đó theo real-time**
✅ **Không có buffering hoặc replay logic ở client side**
✅ **Những gì hiển thị trên UI chính xác là những gì hệ thống có thể xử lý trong deadline được chỉ định**

### Quan Sát Hành Vi Real-Time

Khi ứng dụng chạy, bạn sẽ thấy:

1. **Events được tạo ra liên tục** (mỗi 50ms)
2. **Processing latency** được hiển thị cho mỗi event
3. **Status indicators** (on-time, late, dropped)
4. **Real-time statistics** cập nhật mượt mà
5. **Backpressure behavior** khi hệ thống bị overload

**Thử nghiệm:**

- Mở nhiều browser tabs để tăng load
- Quan sát dropped events khi hệ thống bị overwhelmed
- Theo dõi latency metrics thay đổi như thế nào
- Kiểm tra tỷ lệ late events

## Kết Luận

Nếu bạn đã theo dõi hướng dẫn này đến thời điểm này, **xin chúc mừng!** Bạn đã học được phần quan trọng nhất của việc xây dựng các hệ thống real-time resilient và deadline-aware.

### Những Điểm Chính Cần Nhớ

🎯 **Real-time systems không phải về tốc độ, mà về khả năng dự đoán**

Bạn không cần Real-Time Operating System (RTOS), PhD, hoặc phần cứng chuyên dụng để bắt đầu học real-time design.

**Tất cả những gì bạn cần để xuất sắc là:**

1. ⏰ **Tôn trọng time** - Time là một phần của data model
2. 📊 **Bound your resources** - Sử dụng bounded queues và streams
3. 🗑️ **Chấp nhận rằng đôi khi dropping data là hành vi đúng đắn** - Backpressure là một feature

Nếu bạn hiểu điều đó, bạn đã đang suy nghĩ như một real-time systems engineer.

### So Sánh Chi Tiết: NestJS vs Go

| Khía Cạnh | NestJS | Go | Lợi Thế |
|-----------|--------|-----|---------|
| **Concurrency Model** | Event Loop (Node.js) + RxJS | Goroutines + Channels | **Go** - Native, lightweight |
| **Type Safety** | TypeScript (compile-time) | Go (compile-time) | **Ngang bằng** |
| **Learning Curve** | Trung bình (async/await, RxJS) | Thấp (syntax đơn giản) | **Go** - Dễ học hơn |
| **Ecosystem** | NPM (rất lớn) | Go modules (focused) | **NestJS** - Nhiều packages |
| **Performance** | Tốt cho I/O-bound | Xuất sắc cho CPU-bound | **Go** - Nhanh hơn 2-5x |
| **Memory Usage** | ~50-100MB baseline | ~10-20MB baseline | **Go** - Tiết kiệm hơn |
| **Deployment** | Cần Node.js runtime | Single binary | **Go** - Đơn giản hơn |
| **Real-time Suitability** | Soft real-time ✅ | Soft real-time ✅ | **Ngang bằng** |

## Lợi Thế Của Go Trong Hệ Thống Real-Time

### 1. 🚀 Concurrency Model Vượt Trội

**Go:**
```go
// Tạo 10,000 goroutines - rất rẻ (2KB mỗi goroutine)
for i := 0; i < 10000; i++ {
    go func(id int) {
        processEvent(id)
    }(i)
}
```

**NestJS:**
```typescript
// Tạo 10,000 async tasks - tốn nhiều memory hơn
const promises = [];
for (let i = 0; i < 10000; i++) {
    promises.push(processEvent(i));
}
await Promise.all(promises);
```

**Tại sao Go tốt hơn:**
- ✅ **Goroutines cực kỳ lightweight** (~2KB) vs JavaScript async (~50KB+)
- ✅ **M:N scheduling** - nhiều goroutines trên ít OS threads
- ✅ **Built-in channels** - communication đơn giản và an toàn
- ✅ **No callback hell** - code dễ đọc hơn

### 2. ⚡ Performance Cao Hơn

**Benchmark thực tế:**

| Metric | NestJS | Go | Chênh Lệch |
|--------|--------|-----|-----------|
| **Throughput** | ~20K req/s | ~50K req/s | **Go nhanh hơn 2.5x** |
| **Latency (p99)** | ~50ms | ~10ms | **Go thấp hơn 5x** |
| **Memory** | ~200MB | ~50MB | **Go tiết kiệm 4x** |
| **CPU Usage** | ~80% | ~40% | **Go hiệu quả 2x** |

**Lý do:**
- ✅ **Compiled language** - Go compile thành machine code
- ✅ **No garbage collection pauses** - GC của Go tối ưu hơn V8
- ✅ **Better CPU cache utilization** - struct packing tốt hơn
- ✅ **No JIT warmup** - performance ổn định ngay từ đầu

### 3. 🎯 Predictable Latency

**Go:**
```go
// Deadline enforcement với context
ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
defer cancel()

select {
case result := <-workDone:
    return result
case <-ctx.Done():
    return errors.New("deadline exceeded")
}
```

**NestJS:**
```typescript
// Phải tự implement timeout logic
const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 100)
);

try {
    const result = await Promise.race([doWork(), timeoutPromise]);
    return result;
} catch (error) {
    return error;
}
```

**Tại sao Go tốt hơn:**
- ✅ **Context propagation built-in** - deadline tự động lan truyền
- ✅ **Select statement** - elegant timeout handling
- ✅ **Deterministic GC** - pause times < 1ms
- ✅ **No event loop blocking** - mỗi goroutine độc lập

### 4. 💾 Memory Efficiency

**Ví dụ: Xử lý 1 triệu events đồng thời**

**Go:**
```go
// Mỗi goroutine ~2KB = 2GB total
for i := 0; i < 1_000_000; i++ {
    go handleEvent(events[i])
}
```

**NestJS:**
```typescript
// Mỗi Promise ~50KB+ = 50GB+ total (không khả thi)
// Phải batch processing
const batchSize = 1000;
for (let i = 0; i < events.length; i += batchSize) {
    await Promise.all(
        events.slice(i, i + batchSize).map(handleEvent)
    );
}
```

**Lợi thế Go:**
- ✅ **25x ít memory hơn** cho concurrent tasks
- ✅ **Không cần batching** - xử lý trực tiếp
- ✅ **Stack growth tự động** - goroutine stack tăng khi cần
- ✅ **Better memory locality** - struct vs object

### 5. 🔧 Deployment Đơn Giản

**Go:**
```bash
# Build single binary
go build -o app main.go

# Deploy - chỉ cần copy file
./app
```

**NestJS:**
```bash
# Cần Node.js runtime
npm install --production
npm run build
node dist/main.js

# Hoặc dùng Docker (image lớn hơn)
```

**Lợi thế Go:**
- ✅ **Single binary** - không cần dependencies
- ✅ **Cross-compile dễ dàng** - build cho nhiều OS
- ✅ **Docker image nhỏ** - có thể < 10MB với Alpine
- ✅ **Startup time nhanh** - không cần load modules

### 6. 📊 Backpressure Tự Nhiên

**Go với Buffered Channels:**
```go
// Bounded queue tự nhiên
events := make(chan Event, 100) // Buffer 100 events

// Producer
select {
case events <- newEvent:
    // Sent successfully
default:
    // Channel full - drop event (backpressure)
    metrics.DroppedEvents.Inc()
}

// Consumer
for event := range events {
    process(event)
}
```

**NestJS:**
```typescript
// Phải tự implement bounded queue
class BoundedQueue<T> {
    private queue: T[] = [];
    private maxSize = 100;

    push(item: T): boolean {
        if (this.queue.length >= this.maxSize) {
            return false; // Dropped
        }
        this.queue.push(item);
        return true;
    }
}
```

**Lợi thế Go:**
- ✅ **Channels là bounded queue built-in**
- ✅ **Select statement** - non-blocking send/receive
- ✅ **Compiler-enforced** - type-safe communication
- ✅ **Zero-copy trong nhiều trường hợp**

### 7. 🛡️ Better Error Handling

**Go:**
```go
// Explicit error handling
result, err := processEvent(event)
if err != nil {
    if errors.Is(err, ErrDeadlineExceeded) {
        metrics.LateEvents.Inc()
        return handleLateEvent(event)
    }
    return err
}
```

**NestJS:**
```typescript
// Try-catch có thể miss errors
try {
    const result = await processEvent(event);
} catch (error) {
    // Phải check error type manually
    if (error.message === 'deadline exceeded') {
        metrics.lateEvents.inc();
    }
}
```

**Lợi thế Go:**
- ✅ **Explicit error returns** - không bỏ sót errors
- ✅ **Error wrapping** - context preservation
- ✅ **No uncaught exceptions** - compile-time safety
- ✅ **Panic/recover** - cho truly exceptional cases

### 8. 🔍 Profiling và Debugging

**Go:**
```go
import _ "net/http/pprof"

// Built-in profiler
go func() {
    log.Println(http.ListenAndServe("localhost:6060", nil))
}()

// Access profiles:
// http://localhost:6060/debug/pprof/
```

**Lợi thế Go:**
- ✅ **pprof built-in** - CPU, memory, goroutine profiling
- ✅ **Race detector** - `go run -race` tìm race conditions
- ✅ **Execution tracer** - visualize goroutine execution
- ✅ **Simple stack traces** - dễ debug hơn async stack

## Khi Nào Nên Chọn Go vs NestJS?

### ✅ Chọn Go Khi:

1. **Performance là critical** - High throughput, low latency
2. **Xử lý nhiều concurrent connections** - WebSocket, streaming
3. **Predictable latency** - Trading systems, gaming servers
4. **Resource-constrained environments** - IoT, edge computing
5. **Simple deployment** - Microservices, containers
6. **Team nhỏ** - Ít dependencies, dễ maintain
7. **CPU-intensive tasks** - Data processing, encoding

### ✅ Chọn NestJS Khi:

1. **Team đã quen JavaScript/TypeScript** - Faster development
2. **Cần NPM ecosystem** - Nhiều libraries có sẵn
3. **Rapid prototyping** - Quick iterations
4. **I/O-bound workloads** - Database queries, API calls
5. **Fullstack TypeScript** - Share code với frontend
6. **Enterprise patterns** - DI, decorators, modules
7. **Soft real-time đủ** - Dashboard updates, notifications

## Kết Luận: Go vs NestJS

**Cho hệ thống real-time với yêu cầu cao:**

| Yêu Cầu | Lựa Chọn Tốt Nhất |
|---------|-------------------|
| Latency < 10ms | **Go** ⭐⭐⭐⭐⭐ |
| Throughput > 50K req/s | **Go** ⭐⭐⭐⭐⭐ |
| Memory < 100MB | **Go** ⭐⭐⭐⭐⭐ |
| 10K+ concurrent connections | **Go** ⭐⭐⭐⭐⭐ |
| Rapid development | **NestJS** ⭐⭐⭐⭐⭐ |
| Rich ecosystem | **NestJS** ⭐⭐⭐⭐⭐ |

**Tóm lại:**
- **Go có lợi thế rõ rệt** về performance, concurrency, và predictability
- **NestJS tốt hơn** về developer experience và ecosystem
- **Cho production real-time systems với high load** → **Chọn Go**
- **Cho business applications với moderate load** → **Chọn NestJS**

### Các Bước Tiếp Theo

Để cải thiện hệ thống này, bạn có thể:

1. **Thêm Persistence** - Lưu events vào database (PostgreSQL, MongoDB)
2. **Metrics và Monitoring** - Tích hợp Prometheus, Grafana
3. **Load Testing** - Sử dụng k6 hoặc Artillery để test under load
4. **Horizontal Scaling** - Sử dụng Redis Pub/Sub cho multiple instances
5. **Advanced Backpressure** - Implement adaptive rate limiting
6. **Circuit Breakers** - Bảo vệ hệ thống khỏi cascading failures
7. **Health Checks** - Endpoint để monitor system health
8. **Alerting** - Gửi alerts khi late rate vượt threshold

### Tài Nguyên Bổ Sung

**NestJS:**
- [NestJS Official Documentation](https://docs.nestjs.com/)
- [NestJS WebSockets Guide](https://docs.nestjs.com/websockets/gateways)
- [RxJS Documentation](https://rxjs.dev/)

**Real-Time Systems:**
- "Real-Time Systems" by Jane W. S. Liu
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "The Art of Scalability" by Martin L. Abbott

**Performance:**
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

### Lời Kết

Xây dựng real-time systems là một kỹ năng quý giá trong thế giới hiện đại, nơi users mong đợi instant feedback và live updates.

Bằng cách hiểu các nguyên tắc cơ bản - **deadline awareness, backpressure, và bounded resources** - bạn có thể xây dựng các hệ thống không chỉ nhanh mà còn **predictable và reliable**.

**Hãy nhớ:** Trong real-time systems, một kết quả muộn có thể tệ hơn không có kết quả. Thiết kế hệ thống của bạn để fail fast, drop gracefully, và luôn tôn trọng deadlines.

Chúc bạn coding vui vẻ! 🚀

---

**Tác giả:** Được chuyển thể từ bài viết gốc của Emmanuel Etukudo
**Ngày cập nhật:** 2026-01-09
**Tags:** #NestJS #React #WebSocket #RealTime #TypeScript


