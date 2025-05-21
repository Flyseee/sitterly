import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqCreateApplicationDto {
    @IsInt({ message: 'application orderId must be integer' })
    @IsNotEmpty({ message: 'orderId is empty' })
    @Min(0)
    orderId: number;

    @IsInt({ message: 'application sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    sitterId: number;
}
