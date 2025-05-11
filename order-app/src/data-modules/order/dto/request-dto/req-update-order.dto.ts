import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ReqCreateOrderDto } from '~src/data-modules/order/dto/req-create-order.dto';

export class ReqUpdateOrderDto extends PartialType(ReqCreateOrderDto) {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
