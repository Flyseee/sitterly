import { Inject, Injectable } from '@nestjs/common';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateOrderDto } from '~src/data-modules/order/dto/create-order.dto';
import { GetOrdersForUserDto } from '~src/data-modules/order/dto/get-orders-for-user.dto';
import { UpdateOrderDto } from '~src/data-modules/order/dto/update-order.dto';
import { Order } from '~src/data-modules/order/entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
    ) {}

    get(id: number) {
        return this.orderRepository.findOneBy({ id });
    }

    getActualOrders() {
        const currDate = new Date();
        return this.orderRepository.findBy({ date: MoreThan(currDate) });
    }

    getActualOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        const currDate = new Date();
        return this.orderRepository.findBy({
            sitterId: getOrdersForUserDto.sitterId,
            date: MoreThan(currDate),
        });
    }

    getPassedOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        const currDate = new Date();
        return this.orderRepository.findBy({
            sitterId: getOrdersForUserDto.sitterId,
            date: LessThan(currDate),
        });
    }

    createOrder(createOrderDto: CreateOrderDto) {
        const entity = this.orderRepository.create(createOrderDto);
        return this.orderRepository.save(entity);
    }

    updateOrder(updateOrderDto: UpdateOrderDto) {
        return this.orderRepository.update(
            { id: updateOrderDto.id },
            updateOrderDto,
        );
    }
}
