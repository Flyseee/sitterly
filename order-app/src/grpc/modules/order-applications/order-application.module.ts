import { Module } from '@nestjs/common';
import { ApplicationModule } from '~src/data-modules/application/application.module';
import { SitterProfileDataModule } from '~src/data-modules/client/sitter-profile/sitter-profile-data.module';
import { FuncOrderModule } from '~src/grpc/modules/func-order/func-order.module';
import { OrderApplicationController } from '~src/grpc/modules/order-applications/order-application.controller';
import { OrderApplicationService } from '~src/grpc/modules/order-applications/order-application.service';

@Module({
    imports: [ApplicationModule, SitterProfileDataModule, FuncOrderModule],
    providers: [OrderApplicationService],
    controllers: [OrderApplicationController],
})
export class OrderApplicationModule {}
