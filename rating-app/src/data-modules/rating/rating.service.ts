import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { GetRatingDto } from './dto/getRating.dto';

@Injectable()
export class RatingService {
    constructor(
        @Inject('RATING_REPOSITORY')
        private ratingRepository: Repository<Rating>,
    ) {}

    @Trace('RatingService.get', { logInput: true, logOutput: true })
    async get(getRatingDto: GetRatingDto): Promise<Rating | null> {
        return await this.ratingRepository.findOneBy({
            profileId: getRatingDto.profileId,
            profileType: getRatingDto.profileType,
        });
    }

    @Trace('RatingService.put', { logInput: true, logOutput: true })
    async put(rating: CreateRatingDto) {
        const entity = this.ratingRepository.create(rating);
        return await this.ratingRepository.save(entity);
    }

    // @Trace('RatingService.update', { logInput: true, logOutput: true })
    // async update(
    //     profileId: number,
    //     profileType: ProfileType,
    //     updateRatingDto: UpdateRatingDto,
    // ) {
    //     const ratingEntity = this.ratingRepository.create();
    //
    //     ratingEntity.profileId = profileId;
    //     ratingEntity.profileType = profileType;
    //     if (updateRatingDto.rating) {
    //         ratingEntity.rating = updateRatingDto.rating;
    //     }
    //     if (updateRatingDto.reviewsAmount) {
    //         ratingEntity.reviewsAmount = updateRatingDto.reviewsAmount;
    //     }
    //
    //     return await this.ratingRepository.save(ratingEntity);
    // }
}
