import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CreateApplicationDto {
    @IsInt({ message: 'application id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;

    @IsInt({ message: 'application orderId must be integer' })
    @IsNotEmpty({ message: 'orderId is empty' })
    @Min(0)
    orderId: number;

    @IsInt({ message: 'application sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    sitterId: number;
}
