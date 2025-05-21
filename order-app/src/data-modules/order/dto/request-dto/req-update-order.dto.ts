import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class ReqUpdateOrderDto {
    @IsInt({ message: 'order id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;

    @IsOptional()
    @IsInt({ message: 'order parentId must be integer' })
    @IsNotEmpty({ message: 'parentId is empty' })
    @Min(0)
    parentId?: number;

    @IsOptional()
    @IsInt({ message: 'order sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    sitterId?: number;

    @IsOptional()
    @IsString({ message: 'order description must be string' })
    @IsNotEmpty({ message: 'description is empty' })
    description?: string;

    @IsOptional()
    @IsString({ message: 'order location must be string' })
    @IsNotEmpty({ message: 'location is empty' })
    location?: string;

    @IsOptional()
    @IsInt({ message: 'order durationHours must be integer' })
    @IsNotEmpty({ message: 'durationHours is empty' })
    @Min(0)
    @Max(24)
    durationHours?: number;

    @IsOptional()
    @IsInt({ message: 'order durationMinutes must be integer' })
    @IsNotEmpty({ message: 'durationMinutes is empty' })
    @Min(0)
    @Max(60)
    durationMinutes?: number;

    @IsOptional()
    @IsInt({ message: 'order cost must be integer' })
    @IsNotEmpty({ message: 'cost is empty' })
    @Min(0)
    cost?: number;

    @IsOptional()
    @IsString({ message: 'order kidsDescription must be string' })
    @IsNotEmpty({ message: 'kidsDescription is empty' })
    kidsDescription?: string;

    @IsOptional()
    @IsString({ message: 'order date must be a string' })
    date?: string;
}
