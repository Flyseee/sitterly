import { Injectable, NotFoundException } from '@nestjs/common';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { RatingService } from '~src/data-modules/rating/rating.service';
import { CalcRatingDto } from '~src/data-modules/rating/dto/calcRating.dto';
import { Validator } from 'class-validator';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';

@Injectable()
export class UserRatingService {
    readonly validator = new Validator();

    constructor(private ratingService: RatingService) {}

    @Trace('UserRatingService.put', { logInput: true, logOutput: true })
    async put(rating: CreateRatingDto) {
        return await this.ratingService.put(rating);
    }

    @Trace('UserRatingService.get', { logInput: true, logOutput: true })
    async get(id: number) {
        if (!id)
            throw new RpcException({
                message: 'Id argument is required',
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        const rating: Rating | null = await this.ratingService.get(id);

        if (!rating)
            throw new RpcException({
                message: 'Rating was not found for id: ${id}',
                code: GrpcStatusCode.NOT_FOUND,
            });

        return rating;
    }

    @Trace('UserRatingService.update', { logInput: true, logOutput: true })
    async update(id: number, calcRatingDto: CalcRatingDto) {
        if (!id)
            throw new RpcException({
                message: 'Id argument is required',
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        const rating: Rating | null = await this.get(id);

        const oldRating = rating.rating * rating.reviewsAmount;
        rating.reviewsAmount += 1;
        rating.rating =
            (oldRating + calcRatingDto.stars) / rating.reviewsAmount;

        return await this.ratingService.update(id, rating);
    }
}
