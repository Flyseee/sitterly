import { Module } from '@nestjs/common';
import { FuncOrderController } from '~src/http/func-order/func-order.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [FuncOrderController],
})
export class FuncOrderModule {}
