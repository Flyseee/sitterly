import { DataSource } from 'typeorm';
import { Review } from '../entities/review.entity';

export default {
    provide: 'REVIEW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Review),
    inject: [DataSource],
};
