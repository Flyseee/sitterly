import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export default {
    inject: [ConfigService, Logger],
    provide: DataSource,
    useFactory: async (config: ConfigService, logger: Logger) => {
        const dataSource = new DataSource({
            ...config.getOrThrow<DataSourceOptions>('database.psql'),
            entities: [
                join(__dirname, '../../../**/entities/*.entity{.ts,.js}'),
            ],
            migrations: [
                join(
                    __dirname,
                    '../../../../dist/storage-modules/postgresql/changes/**/*.js',
                ),
            ],
        });
        return await dataSource.initialize();
    },
};
