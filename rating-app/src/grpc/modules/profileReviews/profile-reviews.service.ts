import { Injectable } from '@nestjs/common';
import { Validator } from 'class-validator';
import { CreateFullReviewDto } from '~src/data-modules/reviews/dto/createFullReview.dto';
import { GetReviewForProfileDto } from '~src/data-modules/reviews/dto/getReviewForProfile.dto';
import { ReviewService } from '~src/data-modules/reviews/review.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ProfileReviewsService {
    readonly validator = new Validator();

    constructor(private reviewService: ReviewService) {}

    @Trace('ProfileReviewsService.put', { logInput: true, logOutput: true })
    async put(createFullReviewDto: CreateFullReviewDto) {
        return await this.reviewService.put(createFullReviewDto);
    }

    @Trace('ProfileReviewsService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(getReviewForProfileDto: GetReviewForProfileDto) {
        return await this.reviewService.getListForProfile(
            getReviewForProfileDto,
        );
    }
}
