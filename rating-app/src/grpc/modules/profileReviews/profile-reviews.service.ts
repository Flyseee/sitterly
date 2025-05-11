import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Validator } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ReqCreateFullReviewDto } from '~src/data-modules/review/dto/request-dto/req-create-full-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/dto/request-dto/req-get-reviews-for-profile.dto';
import { ResCreateReviewDto } from '~src/data-modules/review/dto/response-dto/res-create-review.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/dto/response-dto/res-get-reviews-for-profile.dto';
import { ReviewService } from '~src/data-modules/review/review.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ProfileReviewsService {
    readonly validator = new Validator();

    constructor(private reviewService: ReviewService) {}

    @Trace('ProfileReviewsService.put', { logInput: true, logOutput: true })
    async put(
        createFullReviewDto: ReqCreateFullReviewDto,
    ): Promise<ResCreateReviewDto> {
        const review = await this.reviewService.get(createFullReviewDto.id);
        if (review)
            throw new RpcException({
                message: `Review with id = ${createFullReviewDto.id} already exists`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resCreateDto: ResCreateReviewDto =
            await this.reviewService.put(createFullReviewDto);
        return resCreateDto;
    }

    @Trace('ProfileReviewsService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(
        getReviewsForProfileDto: ReqGetReviewsForProfileDto,
    ) {
        const resGetList: ResGetReviewsForProfileDto[] =
            await this.reviewService.getListForProfile(getReviewsForProfileDto);
        return resGetList;
    }
}
