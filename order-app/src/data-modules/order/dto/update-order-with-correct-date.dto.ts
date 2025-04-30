import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { CreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/create-order-with-correct-date.dto';

@Entity()
export class UpdateOrderWithCorrectDateDto extends PartialType(
    CreateOrderWithCorrectDateDto,
) {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
