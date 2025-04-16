import { DataSource } from 'typeorm';
import { Rating } from '../entities/rating.entity';

export default {
    provide: 'RATING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Rating),
    inject: [DataSource],
};
