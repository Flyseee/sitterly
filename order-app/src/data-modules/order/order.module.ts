import { Module } from '@nestjs/common';
import { OrderService } from '~src/data-modules/order/order.service';
import OrderRepositoryProvider from '~src/data-modules/order/provider/order-repository-provider';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [OrderService, OrderRepositoryProvider],
    exports: [OrderService],
})
export class OrderModule {}
