import {
    GetObjectCommand,
    HeadObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class S3Service {
    private readonly bucket: string;
    private readonly region: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly s3: S3Client,
    ) {
        this.bucket = this.configService.getOrThrow<string>('s3.bucketName');
        this.region = this.configService.getOrThrow<string>('s3.region');
    }

    /**
     * Загружает буфер в S3 и возвращает публичный URL
     * @param key Ключ (путь) в бакете
     * @param buffer Содержимое файла
     * @param contentType MIME-тип, например 'image/png'
     * @param metadata Опциональные метаданные
     */
    @Trace('S3Service.uploadBuffer', { logInput: false, logOutput: true })
    async uploadBuffer(
        key: string,
        buffer: Buffer,
        contentType: string,
        metadata?: Record<string, string>,
    ): Promise<string | undefined> {
        // Оборачиваем Buffer в Readable-поток
        const bodyStream = Readable.from(buffer);

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: bodyStream,
                ContentType: contentType,
                Metadata: metadata,
            },
        });
        await upload.done();
        return this.getPresignedUrl(key);
    }

    /**
     * Генерирует временную ссылку для получения файла из S3
     * @param key Ключ (путь) в бакете
     * @param expiresSec Время жизни ссылки в секундах
     */
    @Trace('S3Service.getPresignedUrl', { logInput: true, logOutput: false })
    async getPresignedUrl(
        key: string,
        expiresSec = 3600,
    ): Promise<string | undefined> {
        try {
            await this.s3.send(
                new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
            );
        } catch (err: any) {
            if (
                err.name === 'NotFound' ||
                err.$metadata?.httpStatusCode === 404
            ) {
                return undefined;
            }
            throw err;
        }

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        try {
            return await getSignedUrl(this.s3, command, {
                expiresIn: expiresSec,
            });
        } catch (e) {
            throw new Error(`Ошибка генерации presigned URL: ${e.message}`);
        }
    }
}
