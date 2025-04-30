import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { CreateOrderDto } from '~src/data-modules/order/dto/create-order.dto';

@Entity()
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
