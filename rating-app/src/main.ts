import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { otelSDK } from './telemetry/config/otel-config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);

    const swaggerConf = configService.get('swagger');
    const config = new DocumentBuilder()
        .setTitle(swaggerConf.title)
        .setDescription(swaggerConf.description)
        .addBearerAuth(
            {
                description: 'Default JWT Authorization',
                type: 'http',
                in: 'header',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'defaultBearerAuth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConf.path, app, document, {
        jsonDocumentUrl: swaggerConf.jsonPath,
    });

    otelSDK?.start();

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: ['rating', 'review'],
            protoPath: [
                join(__dirname, './grpc/proto/rating.proto'),
                join(__dirname, './grpc/proto/review.proto'),
            ],
            url: configService.get('grpc.url'),
            loader: {
                enums: String,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.get('http.port') || 3000);
}

bootstrap();
