import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { Review } from '~src/data-modules/reviews/entities/review.entity';
import { CreateReviewDto } from '~src/data-modules/reviews/dto/createReview.dto';
import { GetReviewDto } from '~src/data-modules/reviews/dto/getReview.dto';

@Injectable()
export class ReviewService {
    constructor(
        @Inject('REVIEW_REPOSITORY')
        private reviewRepository: Repository<Review>,
    ) {}

    @Trace('ReviewService.put', { logInput: true, logOutput: true })
    async put(createReviewDto: CreateReviewDto) {
        const entity = this.reviewRepository.create(createReviewDto);
        return await this.reviewRepository.save(entity);
    }

    @Trace('ReviewService.getList', { logInput: true, logOutput: true })
    async getList(getReviewDto: GetReviewDto): Promise<Review[]> {
        return await this.reviewRepository.findBy({
            profileToId: getReviewDto.profileToId,
        });
    }
}
