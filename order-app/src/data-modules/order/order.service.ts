import { Inject, Injectable } from '@nestjs/common';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/create-order-with-correct-date.dto';
import { GetOrdersForUserDto } from '~src/data-modules/order/dto/get-orders-for-user.dto';
import { UpdateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/update-order-with-correct-date.dto';
import { Order } from '~src/data-modules/order/entities/order.entity';
import { ProfileType } from '~src/data-modules/order/enums/profile-type.enum';

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

        if (getOrdersForUserDto.profileType == ProfileType.SITTER) {
            return this.orderRepository.findBy({
                sitterId: getOrdersForUserDto.id,
                date: MoreThan(currDate),
            });
        } else {
            return this.orderRepository.findBy({
                parentId: getOrdersForUserDto.id,
                date: MoreThan(currDate),
            });
        }
    }

    getPassedOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        const currDate = new Date();

        if (getOrdersForUserDto.profileType == ProfileType.SITTER) {
            return this.orderRepository.findBy({
                sitterId: getOrdersForUserDto.id,
                date: LessThan(currDate),
            });
        } else {
            return this.orderRepository.findBy({
                parentId: getOrdersForUserDto.id,
                date: LessThan(currDate),
            });
        }
    }

    createOrder(createOrderDto: CreateOrderWithCorrectDateDto) {
        const entity = this.orderRepository.create(createOrderDto);
        return this.orderRepository.save(entity);
    }

    updateOrder(updateOrderDto: UpdateOrderWithCorrectDateDto) {
        const entity = this.orderRepository.create(updateOrderDto);
        return this.orderRepository.save(entity);
    }
}
