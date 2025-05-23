import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqGetOrderDto {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
