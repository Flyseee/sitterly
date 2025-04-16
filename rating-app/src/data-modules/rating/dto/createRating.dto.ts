import { Entity } from 'typeorm';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@Entity()
export class CreateRatingDto {
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty({ message: 'rating is empty' })
    @Min(0)
    @Max(5)
    rating: number;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty({ message: 'reviews amount is empty' })
    @Min(0)
    reviewsAmount: number;
}
