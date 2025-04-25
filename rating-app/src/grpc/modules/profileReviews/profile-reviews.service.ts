import { Injectable } from '@nestjs/common';
import { Validator } from 'class-validator';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { ReviewService } from '~src/data-modules/reviews/review.service';
import { CreateReviewDto } from '~src/data-modules/reviews/dto/createReview.dto';
import { GetReviewDto } from '~src/data-modules/reviews/dto/getReview.dto';

@Injectable()
export class ProfileReviewsService {
    readonly validator = new Validator();

    constructor(private reviewService: ReviewService) {}

    @Trace('ProfileReviewsService.put', { logInput: true, logOutput: true })
    async put(createReviewDto: CreateReviewDto) {
        return await this.reviewService.put(createReviewDto);
    }

    @Trace('ProfileReviewsService.getList', {
        logInput: true,
        logOutput: true,
    })
    async getList(getReviewDto: GetReviewDto) {
        return await this.reviewService.getList(getReviewDto);
    }
}
