import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { CreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/create-order-with-correct-date.dto';
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

    async createOrder(createOrderDto: CreateOrderDto) {
        const order = await this.orderService.get(createOrderDto.id);
        if (order)
            throw new RpcException({
                message: `Order with id = ${createOrderDto.id} already exists`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const orderDate = new Date(createOrderDto.date);
        const minAllowed = new Date(Date.now() + 60 * 60 * 1000);
        if (orderDate < minAllowed) {
            throw new RpcException({
                message:
                    `Order date must be at least one hour in the future.` +
                    `Minimum allowed: ${minAllowed.toISOString()}`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }

        const orderWithCorrectDate = plainToInstance(
            CreateOrderWithCorrectDateDto,
            {
                ...createOrderDto,
                date: orderDate,
            },
        );

        return this.orderService.createOrder(orderWithCorrectDate);
    }

    async updateOrder(updateOrderDto: UpdateOrderDto) {
        const order = await this.orderService.get(updateOrderDto.id);
        if (!order)
            throw new RpcException({
                message: `Order was not found for id: ${updateOrderDto.id}`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        if (updateOrderDto.date) {
            const orderDate = new Date(updateOrderDto.date);
            Object.assign(order, {
                ...updateOrderDto,
                date: orderDate,
            });
        } else {
            Object.assign(order, updateOrderDto);
        }

        return this.orderService.updateOrder({ ...order });
    }
}
