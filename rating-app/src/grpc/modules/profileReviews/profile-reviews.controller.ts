import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { CreateReviewDto } from '~src/data-modules/reviews/dto/create-review.dto';
import { GetReviewForProfileDto } from '~src/data-modules/reviews/dto/get-review-for-profile.dto';
import { Review } from '~src/data-modules/reviews/entities/review.entity';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { ProfileReviewsService } from '~src/grpc/modules/profileReviews/profile-reviews.service';
import { ValidationUtils } from '~src/utils/validation.utuls';

@Controller('profileReviews')
export class ProfileReviewsController {
    constructor(
        private readonly profileReviewsService: ProfileReviewsService,
    ) {}

    @GrpcMethod('ProfileReviewsRpcService', 'put')
    @GRPCTrace('ProfileReviewsRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(createReviewDto: CreateReviewDto) {
        const dto = await ValidationUtils.validateInput(
            CreateReviewDto,
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
        getReviewForProfileDto: GetReviewForProfileDto,
    ): Promise<Review[]> {
        const dto = await ValidationUtils.validateInput(
            GetReviewForProfileDto,
            getReviewForProfileDto,
        );
        return this.profileReviewsService.getListForProfile(dto);
    }
}
