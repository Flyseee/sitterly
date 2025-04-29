import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { CreateOrderDto } from '~src/data-modules/order/dto/create-order.dto';
import { GetOrdersForUserDto } from '~src/data-modules/order/dto/get-orders-for-user.dto';
import { UpdateOrderDto } from '~src/data-modules/order/dto/update-order.dto';
import { OrderService } from '~src/data-modules/order/order.service';

@Injectable()
export class FuncOrderService {
    constructor(private readonly orderService: OrderService) {}

    getActualOrders() {
        return this.orderService.getActualOrders();
    }

    getActualOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        return this.orderService.getActualOrdersForUser(getOrdersForUserDto);
    }

    getPassedOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        return this.orderService.getPassedOrdersForUser(getOrdersForUserDto);
    }

    createOrder(createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    async updateOrder(updateOrderDto: UpdateOrderDto) {
        const order = await this.orderService.get(updateOrderDto.id);
        if (!order)
            throw new RpcException({
                message: `Order was not found for id: ${updateOrderDto.id}`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        return this.orderService.updateOrder(updateOrderDto);
    }
}
