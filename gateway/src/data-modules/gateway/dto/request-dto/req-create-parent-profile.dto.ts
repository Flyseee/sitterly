import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqCreateParentProfileDto {
    @IsInt({ message: 'parentProfile userId must be integer' })
    @IsNotEmpty({ message: 'parentProfile userId is empty' })
    @Min(0)
    userId: number;

    @IsInt({ message: 'parentProfile ordersAmount must be integer' })
    @IsNotEmpty({ message: 'parentProfile ordersAmount is empty' })
    @Min(0)
    ordersAmount: number;
}
