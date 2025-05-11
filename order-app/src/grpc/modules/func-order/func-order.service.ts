import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ReqCreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/request-dto/req-create-order-with-correct-date.dto';
import { ReqCreateOrderDto } from '~src/data-modules/order/dto/request-dto/req-create-order.dto';
import { ReqGetOrdersForUserDto } from '~src/data-modules/order/dto/request-dto/req-get-orders-for-user.dto';
import { ReqUpdateOrderDto } from '~src/data-modules/order/dto/request-dto/req-update-order.dto';
import { ResCreateOrderDto } from '~src/data-modules/order/dto/response-dto/res-create-order.dto';
import { ResGetActualOrders } from '~src/data-modules/order/dto/response-dto/res-get-actual-orders.dto';
import { ResGetOrdersForUserDto } from '~src/data-modules/order/dto/response-dto/res-get-orders-for-user.dto';
import { ResUpdateOrderDto } from '~src/data-modules/order/dto/response-dto/res-update-order.dto';
import { OrderService } from '~src/data-modules/order/order.service';

@Injectable()
export class FuncOrderService {
    constructor(private readonly orderService: OrderService) {}

    async getActualOrders(): Promise<ResGetActualOrders[]> {
        const resGetOrders: ResGetActualOrders[] =
            await this.orderService.getActualOrders();

        return resGetOrders;
    }

    async getOrdersForUser(
        getOrdersForUserDto: ReqGetOrdersForUserDto,
    ): Promise<ResGetOrdersForUserDto[] | undefined> {
        const resActualOrders: ResGetOrdersForUserDto[] | undefined =
            await this.orderService.getOrdersForUser(getOrdersForUserDto);
        return resActualOrders;
    }

    async createOrder(
        createOrderDto: ReqCreateOrderDto,
    ): Promise<ResCreateOrderDto> {
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
            ReqCreateOrderWithCorrectDateDto,
            {
                ...createOrderDto,
                date: orderDate,
            },
        );

        const resCreateOrder: ResCreateOrderDto =
            await this.orderService.createOrder(orderWithCorrectDate);
        return resCreateOrder;
    }

    async updateOrder(updateOrderDto: ReqUpdateOrderDto) {
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

        const resUpdateOrder: ResUpdateOrderDto =
            await this.orderService.updateOrder({
                ...order,
            });
        return resUpdateOrder;
    }
}
