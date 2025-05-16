import { DataSource } from 'typeorm';
import { UserEntity } from '~src/data-modules/user/entities/user.entity';

export default {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [DataSource],
};
