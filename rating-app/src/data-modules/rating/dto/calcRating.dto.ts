import { Entity } from 'typeorm';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@Entity()
export class CalcRatingDto {
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty({ message: 'rating stars are empty' })
    @Min(0)
    @Max(5)
    stars: number;
}
