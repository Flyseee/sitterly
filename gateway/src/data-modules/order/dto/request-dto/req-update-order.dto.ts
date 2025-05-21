import {
    IsDateString,
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
    @Min(0)
    parentId?: number;

    @IsOptional()
    @IsInt({ message: 'order sitterId must be integer' })
    @Min(0)
    sitterId?: number;

    @IsOptional()
    @IsString({ message: 'order description must be string' })
    description?: string;

    @IsOptional()
    @IsString({ message: 'order location must be string' })
    location?: string;

    @IsOptional()
    @IsInt({ message: 'order durationHours must be integer' })
    @Min(0)
    @Max(24)
    durationHours?: number;

    @IsOptional()
    @IsInt({ message: 'order durationMinutes must be integer' })
    @Min(0)
    @Max(60)
    durationMinutes?: number;

    @IsOptional()
    @IsInt({ message: 'order cost must be integer' })
    @Min(0)
    cost?: number;

    @IsOptional()
    @IsString({ message: 'order kidsDescription must be string' })
    kidsDescription?: string;

    @IsOptional()
    @IsDateString({}, { message: 'order date must be date type' })
    date?: Date;
}
