import { Module } from '@nestjs/common';
import { OrderModule } from '~src/data-modules/order/order.module';
import { FuncOrderController } from '~src/grpc/modules/func-order/func-order.controller';
import { FuncOrderService } from '~src/grpc/modules/func-order/func-order.service';

@Module({
    imports: [OrderModule],
    providers: [FuncOrderService],
    controllers: [FuncOrderController],
})
export class FuncOrderModule {}
