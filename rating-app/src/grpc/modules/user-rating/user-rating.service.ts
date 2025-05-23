import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { Validator } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ParentProfileDataService } from '~src/data-modules/client/parent-profile/parent-profile-data.service';
import { SitterProfileDataService } from '~src/data-modules/client/sitter-profile/sitter-profile.service';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-create-rating.dto';
import { ReqGetRatingDto } from '~src/data-modules/rating/dto/request-dto/req-get-rating.dto';
import { ResCreateRatingDto } from '~src/data-modules/rating/dto/response-dto/res-create-rating.dto';
import { ResGetRatingDto } from '~src/data-modules/rating/dto/response-dto/res-get-rating.dto';
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
        private sitterProfileDataService: SitterProfileDataService,
        private parentProfileDataService: ParentProfileDataService,
    ) {}

    @Trace('UserRatingService.get', { logInput: true, logOutput: true })
    async get(getRatingDto: ReqGetRatingDto): Promise<ResGetRatingDto> {
        const rating: Rating | null =
            await this.ratingService.get(getRatingDto);

        if (!rating)
            throw new RpcException({
                message:
                    `rating was not found for id: ${getRatingDto.profileId}` +
                    ` and profile type: ${getRatingDto.profileType}`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resRatingDto: ResGetRatingDto = { ...rating };
        return resRatingDto;
    }

    @Trace('UserRatingService.put', { logInput: true, logOutput: true })
    async put(
        createRatingDto: ReqCreateRatingDto,
    ): Promise<ResCreateRatingDto> {
        let profile;
        if (createRatingDto.profileType == ProfileType.SITTER) {
            profile = await this.sitterProfileDataService.get(
                createRatingDto.profileId,
            );
        } else if (createRatingDto.profileType == ProfileType.PARENT) {
            profile = await this.parentProfileDataService.get(
                createRatingDto.profileId,
            );
        } else {
            throw new RpcException({
                message: `profile type = ${createRatingDto.profileType} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }
        if (!(profile | profile.data)) {
            throw new RpcException({
                message:
                    `profile with id = ${createRatingDto.profileId} and` +
                    `type = ${createRatingDto.profileType} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }

        const rating = await this.ratingService.get({
            profileId: createRatingDto.profileId,
            profileType: createRatingDto.profileType,
        });
        if (rating)
            throw new RpcException({
                message:
                    `rating with profileId = ${createRatingDto.profileId} and` +
                    `profileType = ${createRatingDto.profileType} already exists`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resRatingDto: ResCreateRatingDto =
            await this.ratingService.put(createRatingDto);
        return resRatingDto;
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
                await this.reviewService.updateProfileReview({
                    profileToId: rating.profileId,
                    profileToType: rating.profileType,
                });
            }
        }
    }
}
