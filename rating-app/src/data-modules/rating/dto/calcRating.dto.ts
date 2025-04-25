import { Entity } from 'typeorm';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@Entity()
export class CalcRatingDto {
    @IsInt({ message: 'rating calcDto stars must be integer' })
    @IsNotEmpty({ message: 'rating stars are empty' })
    @Min(0)
    @Max(5)
    stars: number;
}
