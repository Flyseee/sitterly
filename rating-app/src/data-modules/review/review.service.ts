import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateFullReviewDto } from '~src/data-modules/review/dto/create-full-review.dto';
import { GetReviewForProfileDto } from '~src/data-modules/review/dto/get-review-for-profile.dto';
import { GetUnconsideredResultDto } from '~src/data-modules/review/dto/get-unconsidered-result.dto';
import { GetUnconsideredReviewDto } from '~src/data-modules/review/dto/get-unconsidered-review.dto';
import { UpdateReviewDto } from '~src/data-modules/review/dto/update-review.dto';
import { Review } from '~src/data-modules/review/entities/review.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ReviewService {
    constructor(
        @Inject('REVIEW_REPOSITORY')
        private reviewRepository: Repository<Review>,
    ) {}

    @Trace('ReviewService.put', { logInput: true, logOutput: true })
    async put(createFullReviewDto: CreateFullReviewDto) {
        const entity = this.reviewRepository.create(createFullReviewDto);
        return await this.reviewRepository.save(entity);
    }

    @Trace('ReviewService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(
        getReviewForProfileDto: GetReviewForProfileDto,
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
        getUnconsideredReviewDto: GetUnconsideredReviewDto,
    ): Promise<GetUnconsideredResultDto[]> {
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
    async updateProfileReviews(updateReviewDto: UpdateReviewDto) {
        return await this.reviewRepository.update(
            {
                profileToId: updateReviewDto.profileToId,
                profileToType: updateReviewDto.profileToType,
            },
            { isConsidered: true },
        );
    }
}
