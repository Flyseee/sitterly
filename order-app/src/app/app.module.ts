import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { PostgresqlModule } from 'src/database-modules/postgresql/postgresql.module';
import { RedisModule } from 'src/database-modules/redis/redis.module';
import { RequestLogMiddleware } from '~src/app/middleware/request-log.middleware';
import { GrpcModule } from '~src/grpc/grpc.module';
import { FuncOrderModule } from '~src/grpc/modules/func-order/func-order.module';
import { OrderApplicationModule } from '~src/grpc/modules/order-applications/order-application.module';
import { HttpModule } from '~src/http/http.module';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { TracingInterceptor } from './interceptors/tracing.interceptor';
import { XRequestMiddleware } from './middleware/x-request.middleware';

@Module({
    imports: [
        ConfigModule,
        LoggingModule,
        PostgresqlModule,
        RedisModule,
        TraceModule,
        CacheModule.register({}),
        HttpModule,
        GrpcModule,
        OrderApplicationModule,
        FuncOrderModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TracingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        return consumer
            .apply(XRequestMiddleware)
            .forRoutes('*')
            .apply(RequestLogMiddleware)
            .forRoutes('*');
    }
}
