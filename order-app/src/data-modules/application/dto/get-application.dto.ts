import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class GetApplicationDto {
    @IsInt({ message: 'application orderId must be integer' })
    @IsNotEmpty({ message: 'orderId is empty' })
    @Min(0)
    orderId: number;
}
