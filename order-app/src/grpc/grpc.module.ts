import { Module } from '@nestjs/common';
import { FuncOrderModule } from '~src/grpc/modules/func-order/func-order.module';
import { OrderApplicationModule } from '~src/grpc/modules/order-applications/order-application.module';

@Module({
    imports: [OrderApplicationModule, FuncOrderModule],
})
export class GrpcModule {}
