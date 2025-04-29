import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { Validator } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { CreateRatingDto } from '~src/data-modules/rating/dto/create-rating.dto';
import { GetRatingDto } from '~src/data-modules/rating/dto/get-rating.dto';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { RatingService } from '~src/data-modules/rating/rating.service';
import { ReviewService } from '~src/data-modules/review/review.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class UserRatingService {
    readonly validator = new Validator();

    constructor(
        private ratingService: RatingService,
        private reviewService: ReviewService,
        private logger: Logger,
    ) {}

    @Trace('UserRatingService.get', { logInput: true, logOutput: true })
    async get(getRatingDto: GetRatingDto) {
        const rating: Rating | null =
            await this.ratingService.get(getRatingDto);

        if (!rating)
            throw new RpcException({
                message: `Rating was not found for id: ${getRatingDto.profileId} and profile type: ${getRatingDto.profileType}`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        return rating;
    }

    @Trace('UserRatingService.put', { logInput: true, logOutput: true })
    async put(rating: CreateRatingDto) {
        return await this.ratingService.put(rating);
    }

    @Cron('0 0 0 * * *')
    @Trace('UserRatingService.update', { logInput: true, logOutput: true })
    async update() {
        const limit = 10;
        let listLength = 10000;

        while (listLength == limit) {
            let unconsideredList = await this.reviewService.getUnconsideredList(
                { limit },
            );
            listLength = unconsideredList.length;

            for (const profileReviews of unconsideredList) {
                const rating = await this.get({
                    profileId: profileReviews.profile_to_id,
                    profileType: profileReviews.profile_to_type,
                });

                const oldRating = rating.rating * rating.reviewsAmount;
                const newRating =
                    parseInt(profileReviews.avg) *
                    parseInt(profileReviews.count);
                const newReviewsAmount =
                    parseInt(profileReviews.count) + rating.reviewsAmount;

                rating.rating = (oldRating + newRating) / newReviewsAmount;
                rating.reviewsAmount = newReviewsAmount;

                await this.ratingService.update(rating);
                await this.reviewService.updateProfileReviews({
                    profileToId: rating.profileId,
                    profileToType: rating.profileType,
                });
            }
        }
    }
}
