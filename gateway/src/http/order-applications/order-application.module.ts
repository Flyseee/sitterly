import { Module } from '@nestjs/common';
import { OrderApplicationController } from '~src/http/order-applications/order-application.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [OrderApplicationController],
})
export class OrderApplicationModule {}
