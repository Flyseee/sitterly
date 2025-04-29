import { Injectable } from '@nestjs/common';
import { OrderService } from '~src/data-modules/order/order.service';

@Injectable()
export class OrderApplicationService {
    constructor(private readonly orderService: OrderService) {}
}
