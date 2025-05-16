import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqCreateParentProfileDto {
    @IsInt({ message: 'parentProfile id must be integer' })
    @IsNotEmpty({ message: 'parentProfile id is empty' })
    @Min(0)
    id: number;

    @IsInt({ message: 'parentProfile ordersAmount must be integer' })
    @IsNotEmpty({ message: 'parentProfile ordersAmount is empty' })
    @Min(0)
    ordersAmount: number;
}
