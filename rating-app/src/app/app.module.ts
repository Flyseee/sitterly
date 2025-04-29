import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { PostgresqlModule } from 'src/database-modules/postgresql/postgresql.module';
import { RedisModule } from 'src/database-modules/redis/redis.module';
import { XRequestMiddleware } from './middleware/x-request.middleware';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { GrpcModule } from '~src/grpc/grpc.module';
import { HttpModule } from '~src/http/http.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfileReviewsModule } from '~src/grpc/modules/profileReviews/profile-reviews.module';
import { UserRatingModule } from '~src/grpc/modules/userRating/userRating.module';

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
        ScheduleModule.forRoot(),
        UserRatingModule,
        ProfileReviewsModule,
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: TracingInterceptor,
        // },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        return consumer.apply(XRequestMiddleware).forRoutes('*');
    }
}
