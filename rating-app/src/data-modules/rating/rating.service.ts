import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { UpdateRatingDto } from '~src/data-modules/rating/dto/updateRating.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class RatingService {
    constructor(
        @Inject('RATING_REPOSITORY')
        private ratingRepository: Repository<Rating>,
    ) {}

    @Trace('RatingService.put', { logInput: true, logOutput: true })
    async put(rating: CreateRatingDto) {
        const entity = this.ratingRepository.create(rating);
        return await this.ratingRepository.save(entity);
    }

    @Trace('RatingService.get', { logInput: true, logOutput: true })
    async get(id: number): Promise<Rating | null> {
        return await this.ratingRepository.findOneBy({
            id,
        });
    }

    @Trace('RatingService.update', { logInput: true, logOutput: true })
    async update(id: number, updateRatingDto: UpdateRatingDto) {
        const ratingEntity = this.ratingRepository.create();

        ratingEntity.id = id;
        if (updateRatingDto.rating) {
            ratingEntity.rating = updateRatingDto.rating;
        }
        if (updateRatingDto.reviewsAmount) {
            ratingEntity.reviewsAmount = updateRatingDto.reviewsAmount;
        }

        return await this.ratingRepository.save(ratingEntity);
    }
}
