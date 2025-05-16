import { DataSource } from 'typeorm';
import { ParentProfile } from '~src/data-modules/parent-profile/entities/parent-profile.entity';

export default {
    provide: 'PARENT_PROFILE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ParentProfile),
    inject: [DataSource],
};
