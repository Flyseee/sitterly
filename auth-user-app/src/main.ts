import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import '~src/telemetry/config/otel-config';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const configService = app.get(ConfigService);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('pug');

    const swaggerConf = configService.get('swagger');
    const config = new DocumentBuilder()
        .setTitle(swaggerConf.title)
        .setDescription(swaggerConf.description)
        .addBearerAuth(
            {
                description: 'Default JWT Authorization',
                type: 'http',
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

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'userinfo',
            protoPath: join(__dirname, './grpc/proto/user-info.proto'),
            url: configService.get('grpc.url'),
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.get('http.port') || 3000);
}

bootstrap();
