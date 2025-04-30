import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Validator } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { CreateFullReviewDto } from '~src/data-modules/review/dto/create-full-review.dto';
import { GetReviewForProfileDto } from '~src/data-modules/review/dto/get-review-for-profile.dto';
import { ReviewService } from '~src/data-modules/review/review.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ProfileReviewsService {
    readonly validator = new Validator();

    constructor(private reviewService: ReviewService) {}

    @Trace('ProfileReviewsService.put', { logInput: true, logOutput: true })
    async put(createFullReviewDto: CreateFullReviewDto) {
        const review = await this.reviewService.get(createFullReviewDto.id);
        if (review)
            throw new RpcException({
                message: `Review with id = ${createFullReviewDto.id} already exists`,
                code: GrpcStatusCode.NOT_FOUND,
            });

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
