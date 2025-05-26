import { Module } from '@nestjs/common';
import { ApplicationModule } from '~src/data-modules/application/application.module';
import { FuncOrderModule } from '~src/grpc/modules/func-order/func-order.module';
import { OrderApplicationController } from '~src/grpc/modules/order-applications/order-application.controller';
import { OrderApplicationService } from '~src/grpc/modules/order-applications/order-application.service';

@Module({
    imports: [ApplicationModule, FuncOrderModule],
    providers: [OrderApplicationService],
    controllers: [OrderApplicationController],
})
export class OrderApplicationModule {}
