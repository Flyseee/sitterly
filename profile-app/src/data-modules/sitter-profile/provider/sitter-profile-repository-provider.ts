import { DataSource } from 'typeorm';
import { SitterProfile } from '~src/data-modules/sitter-profile/entities/sitter-profile.entity';

export default {
    provide: 'SITTER_PROFILE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SitterProfile),
    inject: [DataSource],
};
