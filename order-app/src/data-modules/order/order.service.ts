import { Inject, Injectable } from '@nestjs/common';
import { FindOperator, LessThan, MoreThan, Repository } from 'typeorm';
import { OrderDateType } from '~src/data-modules/enums/order-date-type.enum';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/request-dto/req-create-order-with-correct-date.dto';
import { ReqGetOrdersForUserDto } from '~src/data-modules/order/dto/request-dto/req-get-orders-for-user.dto';
import { ReqUpdateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/request-dto/req-update-order-with-correct-date.dto';
import { Order } from '~src/data-modules/order/entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
    ) {}

    get(id: number): Promise<Order | null> {
        return this.orderRepository.findOneBy({ id });
    }

    getActualOrders(): Promise<Order[]> {
        const currDate = new Date();
        return this.orderRepository.findBy({ date: MoreThan(currDate) });
    }

    async getOrdersForUser(
        getOrdersForUserDto: ReqGetOrdersForUserDto,
    ): Promise<Order[] | undefined> {
        const conditionDate = this.getConditionDate(
            getOrdersForUserDto.orderDateType,
        );

        return await this.getOrdersByProfileType(
            getOrdersForUserDto,
            conditionDate,
        );
    }

    createOrder(
        createOrderDto: ReqCreateOrderWithCorrectDateDto,
    ): Promise<Order> {
        const entity = this.orderRepository.create(createOrderDto);
        return this.orderRepository.save(entity);
    }

    updateOrder(
        updateOrderDto: ReqUpdateOrderWithCorrectDateDto,
    ): Promise<Order> {
        const entity = this.orderRepository.create(updateOrderDto);
        return this.orderRepository.save(entity);
    }

    private getConditionDate(orderType: OrderDateType) {
        const currDate = new Date();
        if (orderType == OrderDateType.ACTUAL) {
            return MoreThan(currDate);
        } else if (orderType == OrderDateType.PASSED) {
            return LessThan(currDate);
        }
    }

    private async getOrdersByProfileType(
        getOrdersForUserDto: ReqGetOrdersForUserDto,
        conditionDate: FindOperator<Date> | undefined,
    ): Promise<Order[] | undefined> {
        if (getOrdersForUserDto.profileType == ProfileType.SITTER) {
            return await this.orderRepository.findBy({
                sitterId: getOrdersForUserDto.id,
                date: conditionDate,
            });
        } else if (getOrdersForUserDto.profileType == ProfileType.PARENT) {
            return await this.orderRepository.findBy({
                parentId: getOrdersForUserDto.id,
                date: conditionDate,
            });
        }
    }
}
