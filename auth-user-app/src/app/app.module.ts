import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { PostgresqlModule } from 'src/storage-modules/postgresql/postgresql.module';
import { XRequestMiddleware } from './middleware/x-request.middleware';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { GrpcModule } from '~src/grpc/grpc.module';
import { YamlConfigModule } from '@followtheowlets/yaml-conf';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { RequestLogMiddleware } from '~src/app/middleware/request-log.middleware';
import { S3Module } from '~src/storage-modules/s3/s3.module';
import { HttpModule } from '~src/http/http.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        YamlConfigModule.forRoot({ filePath: 'config' }),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (config) => {
                return {
                    secret: config.get('service.auth.jwtSecret'),
                    signOptions: { expiresIn: '30d' },
                };
            },
        }),
        ConfigModule,
        LoggingModule,
        PostgresqlModule,
        HttpModule,
        TraceModule,
        GrpcModule,
        S3Module,
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: TracingInterceptor,
        // },
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
