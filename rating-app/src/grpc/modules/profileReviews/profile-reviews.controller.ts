import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCreateReviewDto } from '~src/data-modules/review/dto/request-dto/req-create-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/dto/request-dto/req-get-reviews-for-profile.dto';
import { ResCreateReviewDto } from '~src/data-modules/review/dto/response-dto/res-create-review.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/dto/response-dto/res-get-reviews-for-profile.dto';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { ProfileReviewsService } from '~src/grpc/modules/profileReviews/profile-reviews.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller('profileReviews')
export class ProfileReviewsController {
    constructor(
        private readonly profileReviewsService: ProfileReviewsService,
    ) {}

    @GrpcMethod('ProfileReviewsRpcService', 'put')
    @GRPCTrace('ProfileReviewsRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(
        createReviewDto: ReqCreateReviewDto,
    ): Promise<ResCreateReviewDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateReviewDto,
            createReviewDto,
        );
        let date = new Date().toISOString().split('T')[0];

        return this.profileReviewsService.put({
            ...dto,
            date,
            isConsidered: false,
        });
    }

    @GrpcMethod('ProfileReviewsRpcService', 'getListForProfile')
    @GRPCTrace('ProfileReviewsRpcService.getListForProfile')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getListForProfile(
        getReviewForProfileDto: ReqGetReviewsForProfileDto,
    ): Promise<ResGetReviewsForProfileDto[]> {
        const dto = await ValidationUtils.validateInput(
            ReqGetReviewsForProfileDto,
            getReviewForProfileDto,
        );
        return this.profileReviewsService.getListForProfile(dto);
    }
}
