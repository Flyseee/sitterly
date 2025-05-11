import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ReqCreateOrderWithCorrectDateDto } from '~src/data-modules/order/dto/req-create-order-with-correct-date.dto';

export class ReqUpdateOrderWithCorrectDateDto extends PartialType(
    ReqCreateOrderWithCorrectDateDto,
) {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
