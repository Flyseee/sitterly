import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqGetUnconsideredReviewDto {
    @IsInt({ message: 'review limit must be an integer' })
    @IsNotEmpty({ message: 'review limit is empty' })
    @Min(0)
    limit: number;
}
