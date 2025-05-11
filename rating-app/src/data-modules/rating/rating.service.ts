import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReqCreateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-create-rating.dto';
import { ReqUpdateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-update-rating.dto';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { ReqGetRatingDto } from './dto/request-dto/req-get-rating.dto';

@Injectable()
export class RatingService {
    constructor(
        @Inject('RATING_REPOSITORY')
        private ratingRepository: Repository<Rating>,
    ) {}

    @Trace('RatingService.get', { logInput: true, logOutput: true })
    async get(getRatingDto: ReqGetRatingDto): Promise<Rating | null> {
        return await this.ratingRepository.findOneBy({
            profileId: getRatingDto.profileId,
            profileType: getRatingDto.profileType,
        });
    }

    @Trace('RatingService.put', { logInput: true, logOutput: true })
    async put(rating: ReqCreateRatingDto): Promise<Rating> {
        const entity = this.ratingRepository.create(rating);
        return await this.ratingRepository.save(entity);
    }

    @Trace('RatingService.update', { logInput: true, logOutput: true })
    async update(updateRatingDto: ReqUpdateRatingDto): Promise<Rating> {
        const entity = this.ratingRepository.create(updateRatingDto);
        return this.ratingRepository.save(entity);
    }
}
