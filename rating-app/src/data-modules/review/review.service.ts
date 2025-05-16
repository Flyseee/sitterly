import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GetUnconsideredResultAg } from '~src/data-modules/review/aggregation-object/get-unconsidered-result.ag';
import { ReqCreateFullReviewDto } from '~src/data-modules/review/dto/request-dto/req-create-full-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/dto/request-dto/req-get-reviews-for-profile.dto';
import { ReqGetUnconsideredReviewDto } from '~src/data-modules/review/dto/request-dto/req-get-unconsidered-review.dto';
import { ReqUpdateReviewDto } from '~src/data-modules/review/dto/request-dto/req-update-review.dto';
import { Review } from '~src/data-modules/review/entities/review.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ReviewService {
    constructor(
        @Inject('REVIEW_REPOSITORY')
        private reviewRepository: Repository<Review>,
    ) {}

    @Trace('ReviewService.get', { logInput: true, logOutput: true })
    get(id: number): Promise<Review | null> {
        return this.reviewRepository.findOneBy({ id });
    }

    @Trace('ReviewService.put', { logInput: true, logOutput: true })
    async put(createFullReviewDto: ReqCreateFullReviewDto): Promise<Review> {
        const entity = this.reviewRepository.create(createFullReviewDto);
        return await this.reviewRepository.save(entity);
    }

    @Trace('ReviewService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(
        getReviewForProfileDto: ReqGetReviewsForProfileDto,
    ): Promise<Review[]> {
        return await this.reviewRepository.findBy({
            profileToId: getReviewForProfileDto.profileToId,
            profileToType: getReviewForProfileDto.profileToType,
        });
    }

    @Trace('ReviewService.getUnconsideredList', {
        logInput: true,
        logOutput: true,
    })
    async getUnconsideredList(
        getUnconsideredReviewDto: ReqGetUnconsideredReviewDto,
    ): Promise<GetUnconsideredResultAg[]> {
        return await this.reviewRepository.query(
            `SELECT profile_to_id, profile_to_type, AVG(stars) as avg, COUNT(stars) as count ` +
                `FROM review ` +
                `WHERE is_considered = false ` +
                `GROUP BY profile_to_id, profile_to_type ` +
                `LIMIT ${getUnconsideredReviewDto.limit} ` +
                `OFFSET 0`,
        );
    }

    @Trace('ReviewService.update', {
        logInput: true,
        logOutput: true,
    })
    async updateProfileReview(
        updateReviewDto: ReqUpdateReviewDto,
    ): Promise<Review> {
        const entity = this.reviewRepository.create({
            ...updateReviewDto,
            isConsidered: true,
        });
        return this.reviewRepository.save(entity);
    }
}
