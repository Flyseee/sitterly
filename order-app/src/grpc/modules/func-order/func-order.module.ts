import { Module } from '@nestjs/common';
import { ParentProfileDataModule } from '~src/data-modules/client/parent-profile/parent-profile-data.module';
import { SitterProfileDataModule } from '~src/data-modules/client/sitter-profile/sitter-profile-data.module';
import { OrderModule } from '~src/data-modules/order/order.module';
import { FuncOrderController } from '~src/grpc/modules/func-order/func-order.controller';
import { FuncOrderService } from '~src/grpc/modules/func-order/func-order.service';

@Module({
    imports: [OrderModule, SitterProfileDataModule, ParentProfileDataModule],
    providers: [FuncOrderService],
    controllers: [FuncOrderController],
    exports: [FuncOrderService],
})
export class FuncOrderModule {}
