import { DataSource } from 'typeorm';
import { Order } from '~src/data-modules/order/entities/order.entity';

export default {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: [DataSource],
};
