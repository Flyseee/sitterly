import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class GetUnconsideredReviewDto {
    @IsInt({ message: 'review limit must be an integer' })
    @IsNotEmpty({ message: 'review limit is empty' })
    @Min(0)
    limit: number;
}
