import { DataSource } from 'typeorm';
import { Application } from '~src/data-modules/application/entities/application.entity';

export default {
    provide: 'APPLICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Application),
    inject: [DataSource],
};
