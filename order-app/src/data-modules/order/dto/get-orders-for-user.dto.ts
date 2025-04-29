import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class GetOrdersForUserDto {
    @IsInt({ message: 'order sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    sitterId: number;
}
