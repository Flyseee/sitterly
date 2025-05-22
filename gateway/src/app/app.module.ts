import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { RedisModule } from 'src/database-modules/redis/redis.module';
import { RequestLogMiddleware } from '~src/app/middleware/request-log.middleware';
import { GrpcModule } from '~src/grpc/grpc.module';
import { FuncOrderModule } from '~src/http/func-order/func-order.module';
import { HttpModule } from '~src/http/http.module';
import { OrderApplicationModule } from '~src/http/order-applications/order-application.module';
import { ProfileReviewsModule } from '~src/http/profile-reviews/profile-reviews.module';
import { UserInfoModule } from '~src/http/user-info/user-info.module';
import { UserRatingModule } from '~src/http/user-rating/user-rating.module';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { TracingInterceptor } from './interceptors/tracing.interceptor';
import { XRequestMiddleware } from './middleware/x-request.middleware';

@Module({
    imports: [
        ConfigModule,
        LoggingModule,
        // PostgresqlModule,
        RedisModule,
        TraceModule,
        CacheModule.register({}),
        HttpModule,
        GrpcModule,
        UserInfoModule,
        OrderApplicationModule,
        FuncOrderModule,
        ProfileReviewsModule,
        UserRatingModule,
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
