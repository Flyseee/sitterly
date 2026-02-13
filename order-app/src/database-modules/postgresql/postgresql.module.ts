import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceProvider from './provider/data-source.provider';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService, Logger],
            useFactory: (config: ConfigService) => {
                return config.getOrThrow('database.psql');
            },
        }),
    ],
    providers: [dataSourceProvider],
    exports: [dataSourceProvider],
})
export class PostgresqlModule {}
