import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ReqCreateSitterProfileDto {
    @IsInt({ message: 'sitterProfile ordersAmount must be integer' })
    @IsNotEmpty({ message: 'sitterProfile ordersAmount is empty' })
    @Min(0)
    ordersAmount: number;

    @IsInt({ message: 'sitterProfile price must be integer' })
    @IsNotEmpty({ message: 'sitterProfile price is empty' })
    @Min(0)
    price: number;

    @IsString({ message: 'sitterProfile location must be string' })
    @IsNotEmpty({ message: 'sitterProfile location is empty' })
    location: string;
}
