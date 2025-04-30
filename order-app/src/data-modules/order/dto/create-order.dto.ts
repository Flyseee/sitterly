import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CreateOrderDto {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;

    @IsInt({ message: 'order parentId must be integer' })
    @IsNotEmpty({ message: 'parentId is empty' })
    @Min(0)
    parentId: number;

    @IsInt({ message: 'order sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    sitterId: number;

    @IsString({ message: 'order description must be string' })
    @IsNotEmpty({ message: 'description is empty' })
    description: string;

    @IsString({ message: 'order location must be string' })
    @IsNotEmpty({ message: 'location is empty' })
    location: string;

    @IsInt({ message: 'order durationHours must be integer' })
    @IsNotEmpty({ message: 'durationHours is empty' })
    @Min(0)
    @Max(24)
    durationHours: number;

    @IsInt({ message: 'order durationMinutes must be integer' })
    @IsNotEmpty({ message: 'durationMinutes is empty' })
    @Min(0)
    @Max(60)
    durationMinutes: number;

    @IsInt({ message: 'order cost must be integer' })
    @IsNotEmpty({ message: 'cost is empty' })
    @Min(0)
    cost: number;

    @IsString({ message: 'order kidsDescription must be string' })
    @IsNotEmpty({ message: 'kidsDescription is empty' })
    kidsDescription: string;

    @IsString({ message: 'order date must be a string' })
    date: string;
}
