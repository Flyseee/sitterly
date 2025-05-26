import { Module } from '@nestjs/common';
import { OrderService } from '~src/data-modules/order/order.service';

@Module({
    imports: [],
    providers: [OrderService],
    controllers: [],
})
export class OrderModule {}
