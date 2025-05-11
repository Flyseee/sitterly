import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqGetApplicationDto {
    @IsInt({ message: 'application orderId must be integer' })
    @IsNotEmpty({ message: 'orderId is empty' })
    @Min(0)
    orderId: number;
}
